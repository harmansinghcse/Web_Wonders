import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import dinosaurTemplate from "../data/dinosaurTemplate";
import { saveDraftToDb, loadDraftFromDb, clearDraftFromDb } from "../utils/draftDb";

const EditorContext = createContext(null);

export const useEditor = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error("useEditor must be used within an EditorProvider");
    }
    return context;
};

export const EditorProvider = ({ children }) => {
    const [dinosaur, setDinosaur] = useState(() => {
        // Deep copy of the template
        return JSON.parse(JSON.stringify(dinosaurTemplate));
    });

    const [files, setFiles] = useState({
        heroBackground: null,
        fossilImage: null,
        dietImage: null,
        featureImages: [null, null, null, null],
    });

    const [isDirty, setIsDirty] = useState(false);
    const [saveStatus, setSaveStatus] = useState("saved"); // 'unsaved' | 'saving' | 'saved'
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [isReviewMode, setIsReviewMode] = useState(false);
    const autoSaveTimerRef = useRef(null);

    // Helper to set nested object properties via path string
    const updateDinosaur = (path, value) => {
        setDinosaur((prev) => {
            const copy = JSON.parse(JSON.stringify(prev));
            const parts = path.split(".");
            let current = copy;
            for (let i = 0; i < parts.length - 1; i++) {
                if (current[parts[i]] === undefined) {
                    current[parts[i]] = {};
                }
                current = current[parts[i]];
            }
            current[parts[parts.length - 1]] = value;
            return copy;
        });
        setIsDirty(true);
        setSaveStatus("unsaved");
    };

    // Helper to set files
    const updateFile = (key, value, index = null) => {
        setFiles((prev) => {
            const next = { ...prev };
            if (index !== null && Array.isArray(next[key])) {
                const arr = [...next[key]];
                arr[index] = value;
                next[key] = arr;
            } else {
                next[key] = value;
            }
            return next;
        });
        setIsDirty(true);
        setSaveStatus("unsaved");
    };

    // Load local draft
    const loadDraft = async () => {
        try {
            const draft = await loadDraftFromDb();
            if (draft) {
                const { dinosaur: draftDino, files: draftFiles } = draft;

                // Regenerate object URLs for previews
                const updatedDino = JSON.parse(JSON.stringify(draftDino));
                if (draftFiles.heroBackground) {
                    updatedDino.images.heroBackground = URL.createObjectURL(draftFiles.heroBackground);
                }
                if (draftFiles.fossilImage) {
                    updatedDino.fossil.image = URL.createObjectURL(draftFiles.fossilImage);
                }
                if (Array.isArray(draftFiles.featureImages)) {
                    draftFiles.featureImages.forEach((file, index) => {
                        if (file) {
                            updatedDino.physicalFeatures.features[index].image = URL.createObjectURL(file);
                        }
                    });
                }

                setDinosaur(updatedDino);
                setFiles(draftFiles);
                setIsDirty(false);
                setSaveStatus("saved");
                return true;
            }
        } catch (error) {
            console.error("Failed to load local draft", error);
        }
        return false;
    };

    // Save draft manually
    const saveDraft = async () => {
        try {
            setSaveStatus("saving");
            await saveDraftToDb(dinosaur, files);
            setIsDirty(false);
            setSaveStatus("saved");
        } catch (error) {
            console.error("Failed to save local draft", error);
            setSaveStatus("unsaved");
        }
    };

    // Clear local draft
    const clearDraft = async () => {
        try {
            await clearDraftFromDb();
            setIsDirty(false);
            setSaveStatus("saved");
        } catch (error) {
            console.error("Failed to clear local draft", error);
        }
    };

    // Auto-save logic
    useEffect(() => {
        if (!isDirty || isReviewMode) return;

        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
        }

        setSaveStatus("unsaved");

        autoSaveTimerRef.current = setTimeout(async () => {
            try {
                setSaveStatus("saving");
                await saveDraftToDb(dinosaur, files);
                setIsDirty(false);
                setSaveStatus("saved");
            } catch (err) {
                console.error("Auto-save failed", err);
                setSaveStatus("unsaved");
            }
        }, 1500); // 1.5 seconds idle auto-save

        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, [dinosaur, files, isDirty, isReviewMode]);

    return (
        <EditorContext.Provider
            value={{
                dinosaur,
                setDinosaur,
                files,
                setFiles,
                updateDinosaur,
                updateFile,
                isDirty,
                setIsDirty,
                saveStatus,
                setSaveStatus,
                isPreviewMode,
                setIsPreviewMode,
                isReviewMode,
                setIsReviewMode,
                loadDraft,
                saveDraft,
                clearDraft,
            }}
        >
            {children}
        </EditorContext.Provider>
    );
};
