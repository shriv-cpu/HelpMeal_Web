import Link from "next/link";

export default async function ClaimSuccessPage() {
  return (
    <main className="min-h-screen bg-[#f7faf8] px-6 py-16">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
        <div className="w-full rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-12">
          
          {/* Success Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf5ec]">
            <span className="text-4xl">✓</span>
          </div>

          {/* Heading */}
          <h1 className="mt-6 text-3xl font-bold text-[#151b17] sm:text-4xl">
            Request sent successfully!
          </h1>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-md leading-7 text-gray-600">
            The person who shared this food has received your request.
            You will be notified when they approve or deny it.
          </p>

          {/* Status */}
          <div className="mx-auto mt-8 max-w-md rounded-2xl bg-[#f7faf8] p-5">
            <p className="text-sm font-semibold text-[#198754]">
              Request Pending
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Please wait for the food owner to respond to your request.
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/home"
              className="rounded-xl bg-[#198754] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#157347]"
            >
              Back to Home
            </Link>

            <Link
              href="/notifications"
              className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              View Notifications
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}