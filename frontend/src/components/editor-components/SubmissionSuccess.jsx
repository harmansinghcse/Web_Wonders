import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function SubmissionSuccess({ open }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-2xl">
                <CheckCircle2 size={70} className="mx-auto text-green-600" />
                {/* Submit created Dino */}
                <h2 className="mt-6 text-3xl font-bold">Dinosaur Submitted!</h2>

                <p className="mt-4 text-gray-600">
                    Your dinosaur has been successfully submitted for review.
                    You'll be able to see it once it's approved by an
                    administrator.
                </p>

                <Link
                    to="/"
                    className="mt-8 inline-block rounded-lg bg-[#2D6A4F] px-8 py-3 font-semibold text-white hover:bg-[#1B4332]"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
