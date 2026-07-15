import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Save, Eye, EyeOff, Check, RefreshCw, Send, CheckCircle2, AlertOctagon, XOctagon } from "lucide-react";
import { EditorProvider, useEditor } from "../context/EditorContext";
import { useAuth } from "../context/AuthContext";
import { loadDraftFromDb } from "../utils/draftDb";

// Editor Form Components
import BasicInfo from "../components/editor-components/BasicInfo";
import DinoIntro from "../components/editor-components/dinoIntro";
import Fossil from "../components/editor-components/fossil";
import PhysicalFeatures from "../components/editor-components/physicalFeatures";
import TimelineStrat from "../components/editor-components/TimlineStrat";
import DietFact from "../components/editor-components/DietFact";
import QuickFacts from "../components/editor-components/QuickFacts";
import EditorWelcome from "../components/editor-components/EditorWelcome";
import SubmissionSuccess from "../components/editor-components/SubmissionSuccess";

// Preview Display Components
import DisplayDinoIntro from "../components/info-components/dinoIntro";
import DisplayQuickFacts from "../components/info-components/QuickFacts";
import DisplayFossil from "../components/info-components/fossil";
import DisplayPhysicalFeatures from "../components/info-components/physicalFeatures";
import DisplayTimelineStrat from "../components/info-components/TimlineStrat";
import DisplayDietFact from "../components/info-components/DietFact";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const CreateDinosaurContent = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const reviewId = searchParams.get("review");

    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    const [showWelcome, setShowWelcome] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showRestoreModal, setShowRestoreModal] = useState(false);
    const [draftName, setDraftName] = useState("");

    // Review Mode state
    const [reviewData, setReviewData] = useState(null);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);

    // Context states
    const {
        dinosaur,
        setDinosaur,
        files,
        setFiles,
        updateDinosaur,
        updateFile,
        saveStatus,
        isPreviewMode,
        setIsPreviewMode,
        isReviewMode,
        setIsReviewMode,
        loadDraft,
        saveDraft,
        clearDraft,
    } = useEditor();

    // Check for draft on mount (only if not in review mode)
    useEffect(() => {
        if (!reviewId) {
            const checkDraft = async () => {
                try {
                    const draft = await loadDraftFromDb();
                    if (draft) {
                        setDraftName(draft.dinosaur?.name || "Unnamed Dinosaur");
                        setShowRestoreModal(true);
                    }
                } catch (e) {
                    console.error("Failed to check IndexedDB draft:", e);
                }
            };
            checkDraft();
        }
    }, [reviewId]);

    // Handle review load
    useEffect(() => {
        if (reviewId) {
            setIsReviewMode(true);
            setReviewLoading(true);
            setShowWelcome(false); // Skip welcome message in review mode

            const fetchSubmission = async () => {
                try {
                    const response = await fetch(`${API_URL}/api/dinosaur/submissions/${reviewId}`, {
                        credentials: "include",
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                        setReviewData(data.data);
                        setDinosaur(data.data.dinosaurData);
                    } else {
                        toast.error(data.message || "Failed to load submission details");
                        navigate("/admin/submissions");
                    }
                } catch (err) {
                    console.error(err);
                    toast.error("Network error while loading submission");
                    navigate("/admin/submissions");
                } finally {
                    setReviewLoading(false);
                }
            };

            fetchSubmission();
        } else {
            setIsReviewMode(false);
        }
    }, [reviewId, setIsReviewMode, setDinosaur, navigate]);

    const handleRestore = async () => {
        const success = await loadDraft();
        setShowRestoreModal(false);
        if (success) {
            toast.success("Draft loaded from local cache!");
        } else {
            toast.error("Failed to load draft.");
        }
    };

    const handleDiscard = () => {
        clearDraft();
        setShowRestoreModal(false);
        toast.success("Local draft cleared.");
    };

    const handleBackgroundUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        updateFile("heroBackground", file);
        const preview = URL.createObjectURL(file);
        updateDinosaur("images.heroBackground", preview);
    };

    const handleSubmit = async () => {
        if (!dinosaur.images?.heroBackground) {
            toast.error("Please upload a hero background image.");
            return;
        }

        try {
            setSubmitting(true);
            const formData = new FormData();
            const submitDino = JSON.parse(JSON.stringify(dinosaur));

            // Strip local blob preview URLs so we don't save them in DB
            if (submitDino.images?.heroBackground?.startsWith("blob:")) {
                submitDino.images.heroBackground = "";
            }
            if (submitDino.fossil?.image?.startsWith("blob:")) {
                submitDino.fossil.image = "";
            }
            submitDino.physicalFeatures.features.forEach((feature) => {
                if (feature.image?.startsWith("blob:")) {
                    feature.image = "";
                }
            });

            formData.append("dinosaur", JSON.stringify(submitDino));

            if (files.heroBackground) {
                formData.append("heroBackground", files.heroBackground);
            }
            if (files.fossilImage) {
                formData.append("fossilImage", files.fossilImage);
            }
            files.featureImages.forEach((file) => {
                if (file) {
                    formData.append("featureImages", file);
                }
            });

            const endpoint = isAdmin
                ? `${API_URL}/api/dinosaur`
                : `${API_URL}/api/dinosaur/submit`;

            const response = await fetch(endpoint, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message || "Failed to submit dinosaur.");
                return;
            }

            if (data.success) {
                clearDraft();
                setSubmitted(true);
                toast.success(isAdmin ? "Dinosaur published successfully!" : "Dinosaur submitted for review!");
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("An error occurred during submission.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleReviewAction = async (status, feedback = "") => {
        try {
            setSubmitting(true);
            const response = await fetch(`${API_URL}/api/dinosaur/submissions/${reviewId}/review`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ status, feedback }),
            });

            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message || "Failed to submit review.");
                return;
            }

            toast.success(`Submission was successfully ${status}!`);
            navigate("/admin/submissions");
        } catch (err) {
            console.error(err);
            toast.error("Network error during review action");
        } finally {
            setSubmitting(false);
            setShowRejectModal(false);
        }
    };

    if (reviewLoading) {
        return (
            <div className="relative flex min-h-screen items-center justify-center bg-[#0B1A13] text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1E3326_0%,transparent_60%)]" />
                <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-[#C9AA5B]" />
                    <p className="text-sm font-medium text-gray-400">Loading submission data for review...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F7F5] pb-24 text-gray-800">
            {/* Submission success page */}
            <SubmissionSuccess open={submitted} />

            {/* Welcome banner */}
            {!isReviewMode && (
                <EditorWelcome
                    showWelcome={showWelcome}
                    setShowWelcome={setShowWelcome}
                />
            )}

            {/* Local Draft Restore Modal */}
            {showRestoreModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900 p-8 text-white shadow-2xl">
                        <h2 className="text-2xl font-bold tracking-tight">Restore unsaved draft?</h2>
                        <p className="mt-3 text-sm leading-relaxed text-gray-400">
                            We found an auto-saved draft for <strong>{draftName || "unnamed dinosaur"}</strong>. Would you like to restore it and resume editing?
                        </p>
                        <div className="mt-8 flex justify-end gap-3">
                            <button
                                onClick={handleDiscard}
                                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/5"
                            >
                                Discard Draft
                            </button>
                            <button
                                onClick={handleRestore}
                                className="rounded-xl bg-[#C9AA5B] px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-[#d8bb70]"
                            >
                                Restore Draft
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Admin Rejection Feedback Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
                    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-neutral-900 p-8 text-white shadow-2xl">
                        <div className="flex items-center gap-3">
                            <AlertOctagon className="text-red-500" size={24} />
                            <h2 className="text-2xl font-bold tracking-tight">Reject Submission</h2>
                        </div>
                        <p className="mt-3 text-sm text-gray-400">
                            Provide optional feedback detailing what needs to be improved or corrected. This feedback will be visible on the contributor's profile.
                        </p>
                        <textarea
                            rows={4}
                            placeholder="Detail improvements here (e.g. Add more facts about their diet)..."
                            value={feedbackMessage}
                            onChange={(e) => setFeedbackMessage(e.target.value)}
                            className="mt-6 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white placeholder-gray-500 outline-none transition focus:border-red-500/40"
                        />
                        <div className="mt-8 flex justify-end gap-3">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/5"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReviewAction("rejected", feedbackMessage)}
                                disabled={submitting}
                                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                            >
                                {submitting ? "Rejecting..." : "Confirm Rejection"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sticky Header */}
            <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#EADFC9] bg-[#F9F7F5]/90 px-6 py-4 backdrop-blur-md">
                <Link
                    to={isReviewMode ? "/admin/submissions" : "/"}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-gray-900"
                >
                    <ArrowLeft size={16} />
                    {isReviewMode ? "Back to Submissions" : "Back to Home"}
                </Link>

                <h1 className="text-md font-bold uppercase tracking-widest text-[#2A2A2A]">
                    {isReviewMode ? "Moderating Submission" : isPreviewMode ? "Editor / Live Preview" : "Dino Editor"}
                </h1>

                <div className="w-20" />
            </header>

            {/* Render Preview Mode vs. Edit Forms */}
            {isPreviewMode ? (
                <div className="animate-fade-in">
                    {/* Live Preview layout mimicking Dinosaur-page.jsx */}
                    <div className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-black font-sans pt-36">
                        <div className="absolute inset-0 z-0">
                            {dinosaur.images.heroBackground ? (
                                <img
                                    src={dinosaur.images.heroBackground}
                                    alt={dinosaur.name}
                                    className="h-full w-full object-cover object-right sm:object-center opacity-90"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-neutral-950 text-gray-500">
                                    No Hero Background Image Uploaded
                                </div>
                            )}
                            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent"></div>
                            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-transparent to-transparent"></div>
                        </div>

                        <DisplayDinoIntro hero={dinosaur.hero} />
                        <DisplayQuickFacts stats={dinosaur.stats} />
                    </div>

                    <DisplayFossil about={dinosaur.about} fossil={dinosaur.fossil} />
                    <hr className="border-[#c6a87c]" />
                    <DisplayPhysicalFeatures physicalFeatures={dinosaur.physicalFeatures} />
                    <DisplayTimelineStrat timeline={dinosaur.timeline} hunting={dinosaur.hunting} />
                    <DisplayDietFact diet={dinosaur.diet} />
                </div>
            ) : (
                <div className="animate-fade-in">
                    {/* Edit Form layout */}
                    <BasicInfo />

                    <div className="relative flex min-h-screen flex-col justify-end overflow-hidden bg-black font-sans">
                        <div className="absolute inset-0 z-0">
                            {dinosaur.images.heroBackground ? (
                                <img
                                    src={dinosaur.images.heroBackground}
                                    alt="Background"
                                    className="h-full w-full object-cover opacity-70"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-gray-500">
                                    No Hero Background Uploaded
                                </div>
                            )}
                            <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent"></div>
                            <div className="absolute inset-0 bg-linear-to-r from-black/80 via-transparent to-transparent"></div>
                        </div>

                        <div className="relative z-20 mx-auto mt-8 w-full max-w-7xl px-8 md:px-16">
                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/20 bg-black/60 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-black/80">
                                📷 Change Hero Background
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleBackgroundUpload}
                                />
                            </label>
                        </div>

                        <DinoIntro />
                        <QuickFacts />
                    </div>

                    <Fossil />
                    <hr className="border-[#c6a87c]" />
                    <PhysicalFeatures />
                    <TimelineStrat />
                    <DietFact />
                </div>
            )}

            {/* Persistent Professional Editor Toolbar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#EADFC9] bg-[#F9F7F5]/90 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-6">
                    {/* Status panel */}
                    <div className="flex items-center gap-3 text-sm font-medium">
                        {isReviewMode ? (
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-gray-500 font-semibold">Moderation:</span>
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                                    reviewData?.status === "approved" ? "bg-green-500/10 text-green-600 border border-green-500/20" :
                                    reviewData?.status === "rejected" ? "bg-red-500/10 text-red-600 border border-red-500/20" :
                                    "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20"
                                }`}>
                                    {reviewData?.status || "pending"}
                                </span>
                                <span className="text-gray-400">By: {reviewData?.submittedBy?.name || "Anonymous"}</span>
                            </div>
                        ) : (
                            <>
                                <span className="text-gray-500">Draft Status:</span>
                                {saveStatus === "unsaved" && (
                                    <span className="flex items-center gap-1.5 text-amber-600">
                                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                        Unsaved changes
                                    </span>
                                )}
                                {saveStatus === "saving" && (
                                    <span className="flex items-center gap-1.5 text-blue-600">
                                        <RefreshCw size={14} className="animate-spin" />
                                        Saving...
                                    </span>
                                )}
                                {saveStatus === "saved" && (
                                    <span className="flex items-center gap-1.5 text-green-600">
                                        <Check size={16} />
                                        Saved locally
                                    </span>
                                )}
                            </>
                        )}
                    </div>

                    {/* Toolbar Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Always allow Preview toggle */}
                        <button
                            onClick={() => setIsPreviewMode((prev) => !prev)}
                            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            {isPreviewMode ? (
                                <>
                                    <EyeOff size={16} />
                                    Edit Layout
                                </>
                            ) : (
                                <>
                                    <Eye size={16} />
                                    Preview Mode
                                </>
                            )}
                        </button>

                        {isReviewMode ? (
                            // Action buttons for Review Mode (if pending)
                            reviewData?.status === "pending" && (
                                <>
                                    <button
                                        onClick={() => setShowRejectModal(true)}
                                        disabled={submitting}
                                        className="flex items-center gap-2 rounded-xl border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                    >
                                        <XOctagon size={16} />
                                        Reject Submission
                                    </button>
                                    <button
                                        onClick={() => handleReviewAction("approved")}
                                        disabled={submitting}
                                        className="flex items-center gap-2 rounded-xl bg-[#2D6A4F] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#1B4332] disabled:opacity-50"
                                    >
                                        <CheckCircle2 size={16} />
                                        {submitting ? "Approving..." : "Approve & Publish"}
                                    </button>
                                </>
                            )
                        ) : (
                            // Standard Actions for Creator Mode
                            <>
                                <button
                                    onClick={saveDraft}
                                    className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    <Save size={16} />
                                    Save Draft
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex items-center gap-2 rounded-xl bg-[#2D6A4F] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#1B4332] disabled:cursor-not-allowed disabled:opacity-75"
                                >
                                    {isAdmin ? (
                                        <>
                                            <CheckCircle2 size={16} />
                                            {submitting ? "Publishing..." : "Publish Dinosaur"}
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            {submitting ? "Submitting..." : "Submit for Review"}
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const CreateDinosaur = () => {
    return (
        <EditorProvider>
            <CreateDinosaurContent />
        </EditorProvider>
    );
};

export default CreateDinosaur;
