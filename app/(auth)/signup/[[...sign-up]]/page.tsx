import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#f7f8f6] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl min-h-[680px] bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.08)] grid md:grid-cols-2">

        {/* LEFT SIDE */}
        <section className="hidden md:flex bg-[#eaf5ec] relative overflow-hidden p-12 lg:p-16 flex-col justify-between">

          {/* Decorative circles */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#d8ecd9]" />
          <div className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-[#d8ecd9]" />

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#198754] flex items-center justify-center text-white text-xl">
                ♥
              </div>

              <span className="text-2xl font-bold text-[#151b17]">
                HelpMeal
              </span>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 max-w-lg">
            <p className="text-[#198754] font-semibold mb-4">
              FOOD • SHARE • HELP
            </p>

            <h1 className="text-5xl lg:text-6xl font-bold leading-[1.08] text-[#151b17]">
              Share food.
              <br />
              <span className="text-[#198754]">
                Help someone.
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-md">
              Join HelpMeal and become part of a community that
              shares extra food instead of letting it go to waste.
            </p>

            {/* Features */}
            <div className="mt-10 flex gap-3 flex-wrap">

              <div className="bg-white rounded-2xl px-5 py-4 shadow-sm">
                <div className="text-2xl">
                  🍱
                </div>

                <p className="mt-2 text-sm font-medium text-gray-700">
                  Share Food
                </p>
              </div>

              <div className="bg-white rounded-2xl px-5 py-4 shadow-sm">
                <div className="text-2xl">
                  ❤️
                </div>

                <p className="mt-2 text-sm font-medium text-gray-700">
                  Help People
                </p>
              </div>

              <div className="bg-white rounded-2xl px-5 py-4 shadow-sm">
                <div className="text-2xl">
                  ♻️
                </div>

                <p className="mt-2 text-sm font-medium text-gray-700">
                  Reduce Waste
                </p>
              </div>

            </div>
          </div>

          {/* Bottom Text */}
          <p className="relative z-10 text-sm text-gray-500">
            Every meal shared can make a difference.
          </p>

        </section>

        {/* RIGHT SIDE */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-16">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="md:hidden flex items-center gap-2 mb-10">

              <div className="w-10 h-10 rounded-xl bg-[#198754] flex items-center justify-center text-white text-xl">
                ♥
              </div>

              <span className="text-2xl font-bold text-[#151b17]">
                HelpMeal
              </span>

            </div>

            <SignUp
              appearance={{
                variables: {
                  colorPrimary: "#198754",
                  colorForeground: "#151b17",
                  colorMutedForeground: "#6b7280",
                  colorBackground: "#ffffff",
                  borderRadius: "12px",
                  fontFamily: "Arial, sans-serif",
                },

                elements: {
                  card: {
                    boxShadow: "none",
                    border: "none",
                    width: "100%",
                  },

                  headerTitle: {
                    fontSize: "30px",
                    fontWeight: "700",
                    letterSpacing: "-0.5px",
                  },

                  headerSubtitle: {
                    fontSize: "15px",
                    color: "#6b7280",
                    marginTop: "8px",
                  },

                  socialButtonsBlockButton: {
                    height: "50px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: "14px",
                    fontWeight: "500",
                  },

                  formFieldLabel: {
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                  },

                  formFieldInput: {
                    height: "50px",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: "15px",
                  },

                  formButtonPrimary: {
                    height: "50px",
                    borderRadius: "12px",
                    backgroundColor: "#198754",
                    fontSize: "15px",
                    fontWeight: "600",
                  },

                  footerActionLink: {
                    color: "#198754",
                    fontWeight: "600",
                  },

                  identityPreviewText: {
                    color: "#198754",
                  },
                },
              }}
            />

          </div>

        </section>

      </div>
    </main>
  );
}