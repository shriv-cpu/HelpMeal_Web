"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type FoodPost = {
  id: number;
  title: string;
  description: string | null;
  image: string | null;
  foodType: string;
  quantity: string;
  location: string;
  availableUntil: Date | string;
};

type EditFoodFormProps = {
  food: FoodPost;
};

export default function EditFoodForm({
  food,
}: EditFoodFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(food.title);
  const [description, setDescription] = useState(
    food.description ?? ""
  );
  const [image, setImage] = useState(food.image ?? "");
  const [foodType, setFoodType] = useState(food.foodType);
  const [quantity, setQuantity] = useState(food.quantity);
  const [location, setLocation] = useState(food.location);

  const [availableUntil, setAvailableUntil] =
    useState(() => {
      const date = new Date(food.availableUntil);

      const year = date.getFullYear();
      const month = String(
        date.getMonth() + 1
      ).padStart(2, "0");
      const day = String(
        date.getDate()
      ).padStart(2, "0");
      const hours = String(
        date.getHours()
      ).padStart(2, "0");
      const minutes = String(
        date.getMinutes()
      ).padStart(2, "0");

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `/api/food/${food.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            description,
            image,
            foodType,
            quantity,
            location,
            availableUntil,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Failed to update food post"
        );

        return;
      }

      router.push(`/food/${food.id}`);
      router.refresh();
    } catch (error) {
      console.error(
        "Failed to update food:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-semibold text-[#151b17]"
        >
          Food title
        </label>

        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          placeholder="Example: Fresh homemade dinner"
          required
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#198754] focus:ring-2 focus:ring-[#198754]/10"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-semibold text-[#151b17]"
        >
          Description
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="Tell people a little about the food..."
          rows={4}
          className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#198754] focus:ring-2 focus:ring-[#198754]/10"
        />
      </div>

      {/* Image */}
      <div>
        <label
          htmlFor="image"
          className="mb-2 block text-sm font-semibold text-[#151b17]"
        >
          Image URL
        </label>

        <input
          id="image"
          type="url"
          value={image}
          onChange={(event) =>
            setImage(event.target.value)
          }
          placeholder="https://example.com/food.jpg"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#198754] focus:ring-2 focus:ring-[#198754]/10"
        />

        {image && (
          <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
            <img
              src={image}
              alt=""
              className="h-48 w-full object-cover"
            />
          </div>
        )}
      </div>

      {/* Food Type + Quantity */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="foodType"
            className="mb-2 block text-sm font-semibold text-[#151b17]"
          >
            Food type
          </label>

          <select
            id="foodType"
            value={foodType}
            onChange={(event) =>
              setFoodType(event.target.value)
            }
            required
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#198754] focus:ring-2 focus:ring-[#198754]/10"
          >
            <option value="Meal">
              Meal
            </option>

            <option value="Rice">
              Rice
            </option>

            <option value="Snacks">
              Snacks
            </option>

            <option value="Fruits">
              Fruits
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="quantity"
            className="mb-2 block text-sm font-semibold text-[#151b17]"
          >
            Quantity
          </label>

          <input
            id="quantity"
            type="text"
            value={quantity}
            onChange={(event) =>
              setQuantity(event.target.value)
            }
            placeholder="Example: 10 people"
            required
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#198754] focus:ring-2 focus:ring-[#198754]/10"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label
          htmlFor="location"
          className="mb-2 block text-sm font-semibold text-[#151b17]"
        >
          Location
        </label>

        <input
          id="location"
          type="text"
          value={location}
          onChange={(event) =>
            setLocation(event.target.value)
          }
          placeholder="Example: Bhopal"
          required
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#198754] focus:ring-2 focus:ring-[#198754]/10"
        />
      </div>

      {/* Available Until */}
      <div>
        <label
          htmlFor="availableUntil"
          className="mb-2 block text-sm font-semibold text-[#151b17]"
        >
          Available until
        </label>

        <input
          id="availableUntil"
          type="datetime-local"
          value={availableUntil}
          onChange={(event) =>
            setAvailableUntil(
              event.target.value
            )
          }
          required
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#198754] focus:ring-2 focus:ring-[#198754]/10"
        />

        <p className="mt-2 text-xs text-gray-500">
          Choose a future time until which someone
          can collect the food.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() =>
            router.push(`/food/${food.id}`)
          }
          disabled={loading}
          className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-[#198754] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#157347] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving changes..."
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}