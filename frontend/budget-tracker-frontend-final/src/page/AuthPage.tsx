"use client";
import { login, register } from "@/services/Auth";
import LoadingSpinnerButton from "@/ui/LoadingSpinnerButton";
import Modal from "@/ui/Modal";
import Image from "next/image";
import { useRouter } from "next/navigation";
import react, { useRef, useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";

const AuthPage = () => {
  const [type, setType] = useState<"Login" | "Register">("Login");
  const [showPassword, setShowPassword] = useState(false);
  const termsCheckBoxRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    password: "",
  });

  const isLogin = type === "Login";

  const handleSubmit = async (e: react.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    console.log(type);

    try {
      let response;
      if (isLogin) {
        response = await login({
          email: formData.email,
          password: formData.password,
        });
        router.push("/dashboard");
      } else {
        if (!termsCheckBoxRef.current?.checked) {
          setErrors({ error: "kamu harus menyetujui Term & Policy" });
          return;
        }
        response = await register({
          ...formData,
          number: `+62${formData.number}`,
        });
      }

      const token = response.data.token;
      localStorage.setItem("token", token);
    } catch (err) {
      if (err instanceof Error) {
        setErrors({ general: err.message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen justify-center items-center bg-gray-100 flex px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 shadow-2xl max-w-7xl w-full bg-white rounded-2xl overflow-hidden">
        <div className="p-8 sm:p-12 min-h-[750px] flex flex-col justify-center">
          <h2 className="font-bold text-3xl text-gray-900 mb-2">
            {isLogin ? "Sign In" : "Sign Up"}
          </h2>
          <p>{isLogin ? "Wellcome Back" : "Let's Sign Up To Get Started. !"}</p>

          <form onSubmit={handleSubmit} className="pt-4">
            {!isLogin && (
              <div className="grid grid-cols-2 mb-4 gap-2">
                <div>
                  <label
                    htmlFor="fullname"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Fullname
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Doe"
                    className="w-full mt-1 px-4 py-2 border rounded-md border-gray-400"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone_number"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="text-gray-500 left-0 absolute flex justify-center items-center pl-3 pt-1 text-sm inset-y-0">
                      +62
                    </div>
                    <input
                      type="text"
                      value={formData.number}
                      onChange={(e) =>
                        setFormData({ ...formData, number: e.target.value })
                      }
                      placeholder="8xxxxxx"
                      className="w-full mt-1 px-4 py-2  pl-11 border rounded-md border-gray-400"
                    />
                  </div>
                </div>
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="johndoe@gmail.com"
                className="w-full mt-1 px-4 py-2 border rounded-md border-gray-400"
              />
            </div>

            <div className="py-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="********"
                  className="w-full mt-1 px-4 py-2 border rounded-md border-gray-400"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>
            </div>
            {errors.general && (
              <div className="text-red-500 text-sm mt-1">{errors.general}</div>
            )}

            {!isLogin && (
              <div className="flex items-center mb-4">
                <input
                  ref={termsCheckBoxRef}
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-indigo-600 hover:underline"
                    onClick={() => {
                      setShowModal(!showModal);
                    }}
                  >
                    {" "}
                    Term & Privacy Policy
                  </button>
                </label>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }  text-white`}
            >
              {loading ? (
                <>
                  <LoadingSpinnerButton />
                  processing....
                </>
              ) : isLogin ? (
                "Let's Explore"
              ) : (
                "Get Started"
              )}
            </button>
            <p className="mt-6 text-sm text-center text-gray-600">
              {isLogin ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    className="text-indigo-600 hover:underline"
                    onClick={() => {
                      setType("Register");
                    }}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-indigo-600 hover:underline"
                    onClick={() => {
                      setType("Login");
                    }}
                  >
                    Sign In
                  </button>
                </>
              )}
            </p>
          </form>
        </div>

        <div className="hidden md:block bg-indigo-600 relative min-h-[750px] w-full">
          <Image
            src="/images/auth-img.png"
            alt="Auth Image"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {showModal && (
        <Modal
          type="information"
          message="By using this application, you agree to our Terms and Privacy Policy. We may collect usage data to improve your experience. We do not share your data with third parties without your consent. For full details, visit our legal page."
          onOk={() => {
            setShowModal(false);
            if (termsCheckBoxRef.current) {
              termsCheckBoxRef.current.checked = true;
            }
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AuthPage;
