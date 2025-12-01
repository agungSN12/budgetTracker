const { Op, where } = require("sequelize");
const {
  Category,
  User,
  MonthlySummary,
  Transaction,
} = require("../../../models/index");
const { includes, date } = require("zod/v4");
const NotFound = require("../../errors/NotFoundError");
const BadRequestError = require("../../errors/BadRequestError");

class TransactionService {
  async getAllTransaction(userId, page = 1, limit = 10, search = "") {
    const offset = (page - 1) * 10;
    const whereClause = {
      user_id: userId,
    };

    if (search) {
      whereClause[Op.or] = [
        { note: { [Op.like]: `%${search}%` } },
        { desc: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Transaction.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Category,
          attributes: ["name", "description"],
          as: "category",
          required: false,
        },
        {
          model: User,
          attributes: ["id", "name", "email", "number"],
          as: "user",
          required: false,
        },
      ],
      order: [["date", "DESC"]],
      limit,
      offset,
      distinct: true,
    });

    return {
      data: rows,
      pagination: count,
      page,
      limit,
      totalPage: Math.ceil(count / limit),
    };
  }

  async getById(id) {
    const transaction = await Transaction.findOne({
      where: { id },
      include: [
        {
          model: Category,
          attributes: ["name", "description"],
          as: "category",
          required: false,
        },
        {
          model: User,
          attributes: ["id", "name", "email", "number"],
          as: "user",
          required: false,
        },
      ],
    });

    if (!transaction) throw new NotFound("data transaksi tidak di temukan");
    return transaction;
  }

  async create(data) {
    const now = new Date();
    const startMount = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMount = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transaction = await Transaction.findAll({
      where: {
        user_id: data.user_id,
        date: {
          [Op.between]: [startMount, endOfMount],
        },
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    for (const tx of transaction) {
      const amount = parseInt(tx.amount);

      if (tx.type == "income") totalIncome += amount;
      if (tx.type == "expense") totalExpense += amount;
    }

    const amountToAdd = parseInt(data.amount);

    if (data.type === "expense" && totalIncome < totalExpense + amountToAdd) {
      throw new BadRequestError("Income bulan ini tidak mencukupi");
    }

    return Transaction.create(data);
  }

  async update(id, data) {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) throw new NotFound("transaksi tidak di temukan");

    const now = new Date();
    const startMount = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMount = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transactions = await Transaction.findAll({
      where: {
        user_id: transaction.user_id,
        date: {
          [Op.between]: [startMount, endOfMount],
        },
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    for (const tx of transactions) {
      const amount = parseInt(tx.amount);
      if (tx.type === "income") totalIncome += amount;
      if (tx.type === "expense") totalExpense += amount;
    }

    const amountToAdd = parseInt(data.amount);

    if (data.type === "expense" && totalIncome < totalExpense + amountToAdd) {
      throw new BadRequestError("income bulan ini tidak mencukupi");
    }
    return await transaction.update({
      ...data,
      category_id: data.categoryId,
    });
  }

  async delete(id) {
    const transaction = await Transaction.findByPk(id);
    if (!transaction) throw new NotFound("transaksi tidak di temukan");
    await transaction.destroy();
    return true;
  }

  async getMounlySummary(userId) {
    const now = new Date();
    const startMount = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMount = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transaction = await Transaction.findAll({
      where: {
        user_id: userId,
        date: {
          [Op.between]: [startMount, endOfMount],
        },
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    for (const tx of transaction) {
      const amount = tx.amount;

      if (tx.type === "income") totalIncome += amount;
      if (tx.type === "expense") totalExpense += amount;
    }

    const balance = totalIncome - totalExpense;
    const saving = Math.floor(
      Math.max(0, totalIncome - totalExpense) * 0.3 + totalIncome * 0.05
    );

    return {
      income: totalIncome,
      expense: totalExpense,
      balance,
      saving,
    };
  }

  async getMounlyChart(userId) {
    const now = new Date();
    const startMount = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMount = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transaction = await Transaction.findAll({
      where: {
        user_id: userId,
        date: {
          [Op.between]: [startMount, endOfMount],
        },
      },
    });

    const daysInMount = endOfMount.getDate();
    const chartData = [];

    for (let day = 1; day <= daysInMount; day++) {
      chartData.push({
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`,
        income: 0,
        expense: 0,
      });
    }

    for (const tx of transaction) {
      const date = new Date(tx.date);
      const day = date.getDate();
      const amount = parseInt(tx.amount);
      if (chartData[day - 1]) {
        if (tx.type === "income") chartData[day - 1].income += amount;
        if (tx.type === "expense") chartData[day - 1].expense += amount;
      }
    }
    return chartData;
  }

  async getTodayTransaction(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const transaction = await Transaction.findAll({
      where: {
        user_id: userId,
        date: {
          [Op.between]: [today, endOfDay],
        },
      },
      order: [["date", "DESC"]],
      include: [
        {
          model: Category,
          attributes: ["name", "description"],
          as: "category",
          required: false,
        },
        {
          model: User,
          attributes: ["id", "name", "email", "number"],
          as: "user",
          required: false,
        },
      ],
    });
    return transaction;
  }

  async getTodayExpenseStats(userId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const transaction = await Transaction.findAll({
      where: {
        user_id: userId,
        type: "expense",
        date: {
          [Op.between]: [today, endOfDay],
        },
      },
      order: [["date", "DESC"]],
    });

    const total = transaction.reduce((sum, tx) => sum + parseInt(tx.amount), 0);

    return {
      total_expense: total,
      count: transaction.length,
    };
  }
}

module.exports = new TransactionService();
