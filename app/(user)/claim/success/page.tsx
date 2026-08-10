import Link from "next/link";

export default function ClaimSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f8f6] px-6">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf5ec] text-4xl">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-bold text-[#151b17]">
          Food claimed successfully
        </h1>

        <p className="mt-3 leading-6 text-gray-600">
          The food has been reserved for you. You can now coordinate the
          collection with the person who shared it.
        </p>

        <Link
          href="/home"
          className="mt-8 inline-block rounded-xl bg-[#198754] px-7 py-3 font-semibold text-white hover:bg-[#157347]"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}