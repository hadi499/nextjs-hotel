"use client";
import { IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5";
import {
  startTransition,
  useRef,
  useState,
  useTransition,
  useActionState,
} from "react";
import { PutBlobResult } from "@vercel/blob";
import Image from "next/image";
import { BarLoader } from "react-spinners";
import { Amenities } from "@/generated/prisma";
import { saveRoom } from "@/lib/actions";
import clsx from "clsx";

const CreateForm = ({ amenities }: { amenities: Amenities[] }) => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setTransition] = useTransition();

  const handleUpload = () => {
    if (!inputFileRef.current?.files) return null;
    const file = inputFileRef.current.files[0];
    const formData = new FormData();
    formData.set("file", file);
    setTransition(async () => {
      try {
        const response = await fetch("/api/upload", {
          method: "PUT",
          body: formData,
        });
        const data = await response.json();
        if (response.status !== 200) {
          setMessage(data.message);
        }
        const img = data as PutBlobResult;
        setImage(img.url);
      } catch (error) {
        console.log(error);
      }
    });
  };
  const deleteImage = (image: string) => {
    startTransition(async () => {
      try {
        await fetch(`/api/upload/?imageUrl=${image}`, {
          method: "DELETE",
        });
        setImage("");
      } catch (error) {
        console.log(error);
      }
    });
  };
  const [state, formAction, isPending] = useActionState(
    saveRoom.bind(null, image),
    null
  );
  return (
    <form action={formAction}>
      <div className="grid md:grid-cols-12 gap-5">
        <div className="col-span-8 bg-white p-4">
          <div className="mb-4">
            <input
              type="text"
              name="name"
              className="py-2 px-4 rounded-sm border border-gray-400 w-full"
              placeholder="Room Name..."
            />
            <div aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-500 my-2">{state?.error?.name}</p>
            </div>
          </div>
          <div className="mb-4">
            <textarea
              name="description"
              rows={8}
              className="py-2 px-4 rounded-sm border border-gray-400 w-full"
              placeholder="Description..."
            ></textarea>
            <div aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-500 my-2">
                {state?.error?.description}
              </p>
            </div>
          </div>
          <div className="mb-4 grid md:grid-cols-3">
            {amenities.map((item) => (
              <div className="flex items-center mb-4" key={item.id}>
                <input
                  type="checkbox"
                  name="amenities"
                  defaultValue={item.id}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded"
                />
                <label className="ms-2 text-sm font-medium text-gray-900 capitalize">
                  {item.name}
                </label>
              </div>
            ))}

            <div aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-500 my-2">
                {state?.error?.amenities}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-4 bg-white p-4">
          <label
            htmlFor="input-file"
            className="flex flex-col mb-4 items-center justify-center aspect-video border-2 border-gray-300 border-dashed cursor-pointer bg-gray-50 relative"
          >
            <div className="flex flex-col items-center justify-center text-gray-500 pt-5 pb-6 z-10">
              {pending ? <BarLoader /> : null}
              {image ? (
                <button
                  type="button"
                  onClick={() => deleteImage(image)}
                  className="flex items-center justify-center bg-transparent size-6 rounded-sm absolute right-1 top-1 text-white hover:bg-red-400"
                >
                  <IoTrashOutline className="size-4 text-transparent hover:text-white" />
                </button>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <IoCloudUploadOutline />
                  <p className="mb-1 text-sm font-bold">Select Image</p>
                  {message ? (
                    <p className="text-sm text-red-500 my-2">{message}</p>
                  ) : (
                    <p className="text-xs">
                      SVG, PNG, GIF, or Others (Max: 4GB)
                    </p>
                  )}
                </div>
              )}
            </div>
            {!image ? (
              <input
                type="file"
                ref={inputFileRef}
                onChange={handleUpload}
                id="input-file"
                className="hidden"
              />
            ) : (
              <Image
                src={image}
                width={640}
                height={360}
                alt="image"
                className="rounded-md absolute aspect-video object-cover"
              />
            )}
          </label>
          <div className="mb-4">
            <input
              type="text"
              name="capacity"
              className="py-2 px-4 rounded-sm border border-gray-400 w-full"
              placeholder="Capacity.."
            />
            <div aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-500 my-2">
                {state?.error?.capacity}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="price"
              className="py-2 px-4 rounded-sm border border-gray-400 w-full"
              placeholder="Price.."
            />
            <div aria-live="polite" aria-atomic="true">
              <p className="text-sm text-red-500 my-2">{state?.error?.price}</p>
            </div>
          </div>
          {/* general message */}
          {state?.message ? (
            <div className="mb-4 bg-red-200 p-2">
              <span>{state.message}</span>
            </div>
          ) : null}

          <button
            type="submit"
            className={clsx(
              "px-10 py-4 text-center font-semibold text-white w-full bg-orange-400 rounded-sm hover:bg-orange-500 cursor-pointer",
              { "opacity-50 cursor-progress animate-pulse": isPending }
            )}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateForm;
