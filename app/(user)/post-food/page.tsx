"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PostFoodPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    foodType: "",
    quantity: "",
    location: "",
    availableUntil: "",
    image: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/home");
      router.refresh();
    } catch {
      setError("Unable to create food post");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8f6]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-6">
          <Link href="/home" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#198754] text-xl text-white">
              ♥
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#151b17]">
                HelpMeal
              </h1>

              <p className="text-xs text-gray-500">
                Food • Share • Help
              </p>
            </div>
          </Link>

          <Link
            href="/home"
            className="text-sm font-medium text-gray-600 hover:text-[#198754]"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#198754]">
            Help someone today
          </p>

          <h2 className="mt-2 text-4xl font-bold text-[#151b17]">
            Post your leftover food
          </h2>

          <p className="mt-3 text-gray-600">
            Tell people what food you have available and where they can
            collect it.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="space-y-6">

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Food name *
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Example: Veg Biryani"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#198754]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Tell people a little about the food..."
                rows={4}
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#198754]"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Food type *
                </label>

                <select
                  name="foodType"
                  value={form.foodType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#198754]"
                >
                  <option value="">Select type</option>
                  <option value="Meal">Meal</option>
                  <option value="Rice">Rice</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Quantity *
                </label>

                <input
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="Example: 20 plates"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#198754]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Pickup location *
              </label>

              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Example: MP Nagar, Bhopal"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#198754]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Available until *
              </label>

              <input
                type="datetime-local"
                name="availableUntil"
                value={form.availableUntil}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#198754]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Food image URL
              </label>

              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Paste an image URL (optional)"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#198754]"
              />

              <p className="mt-2 text-xs text-gray-500">
                We'll add proper image uploading later.
              </p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#198754] py-4 font-semibold text-white transition hover:bg-[#157347] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Posting food..." : "Share Food"}
            </button>

          </div>
        </form>
      </section>
    </main>
  );
}