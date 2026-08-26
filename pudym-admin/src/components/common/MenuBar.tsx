import React, { useState, useRef } from 'react';
import {
    Bold,
    Italic,
    Strikethrough,
    List,
    ListOrdered,
    Quote,
    Code,
    Baseline,
    Highlighter,
    Trash2,
    ChevronDown,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Underline as UnderlineIcon,
    MoreHorizontal,
    Link as LinkIcon,
    Image as ImageIcon,
    X,
} from 'lucide-react';


// Custom icons for subscript and superscript
const SubIcon = ({ size = 15 }: { size?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="4" y1="4" x2="12" y2="20" />
        <line x1="12" y1="4" x2="4" y2="20" />
        <line x1="20" y1="16" x2="20" y2="20" />
        <line x1="18" y1="18" x2="22" y2="18" />
    </svg>
);

const SuperIcon = ({ size = 15 }: { size?: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="4" y1="4" x2="12" y2="20" />
        <line x1="12" y1="4" x2="4" y2="20" />
        <line x1="20" y1="12" x2="20" y2="16" />
        <line x1="18" y1="14" x2="22" y2="14" />
    </svg>
);

interface MenuBarProps {
    editor: any;
    showMediaButtons?: boolean;
    showLinkButton?: boolean;
}
const MenuBar: React.FC<MenuBarProps> = ({
    editor,
    showMediaButtons = true,
    showLinkButton = true,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [linkText, setLinkText] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [savedSelection, setSavedSelection] = useState<{
        from: number;
        to: number;
    } | null>(null);
    const [linkError, setLinkError] = useState("");
    if (!editor) return null;

    const openLinkModal = () => {
        const { from, to } = editor.state.selection;

        // Save the current selection before opening the modal.
        setSavedSelection({ from, to });

        // Get selected text.
        const selectedText = editor.state.doc.textBetween(
            from,
            to,
            " ",
            " "
        );

        // If cursor is already inside a link, load its existing URL.
        const existingUrl = editor.getAttributes("link").href || "";

        setLinkText(selectedText);
        setLinkUrl(existingUrl);
        setLinkError("");
        setIsLinkModalOpen(true);
    };

    const closeLinkModal = () => {
        setIsLinkModalOpen(false);
        setLinkError("");
    };

    const isValidLinkUrl = (value: string) => {
        try {
            const url = new URL(value.trim());

            return (
                url.protocol === "http:" ||
                url.protocol === "https:"
            );
        } catch {
            return false;
        }
    };

    const insertLink = () => {
        const text = linkText.trim();
        const url = linkUrl.trim();

        if (!text) {
            setLinkError("Please enter link text.");
            return;
        }

        if (!url) {
            setLinkError("Please enter a URL.");
            return;
        }

        if (!isValidLinkUrl(url)) {
            setLinkError("Please enter a valid URL starting with http:// or https://");
            return;
        }

        if (!savedSelection) {
            setLinkError("Please select some text first.");
            return;
        }

        const { from, to } = savedSelection;

        editor
            .chain()
            .focus()
            .setTextSelection({ from, to })
            .insertContentAt(
                { from, to },
                {
                    type: "text",
                    text,
                    marks: [
                        {
                            type: "link",
                            attrs: {
                                href: url,
                                target: "_blank",
                                rel: "noopener noreferrer nofollow",
                            },
                        },
                    ],
                }
            )
            .run();

        setIsLinkModalOpen(false);
        setLinkError("");
    };

    const deleteSelectedText = () => {
        const { from, to } = editor.state.selection;

        // Nothing selected
        if (from === to) {
            return;
        }

        editor
            .chain()
            .focus()
            .deleteSelection()
            .run();
    };

    // Button class matching reference code style
    const btnClass = (active: boolean) =>
        `p-1.5 rounded transition-colors ${active ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:text-blue-500'} cursor-pointer flex items-center justify-center transition-all active:scale-90`;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = () => {
                    editor.chain()
                        .focus()
                        .setImage({ src: reader.result as string })
                        .insertContent('<p></p>')
                        .run();
                };
                reader.readAsDataURL(file);
            });
            if (e.target) e.target.value = '';
        }
    };



    const alignments = [
        { value: "left", icon: <AlignLeft size={15} /> },
        { value: "center", icon: <AlignCenter size={15} /> },
        { value: "right", icon: <AlignRight size={15} /> },
        {
            value: "justify",
            icon: (
                <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="21" y1="10" x2="3" y2="10"></line>
                    <line x1="21" y1="6" x2="3" y2="6"></line>
                    <line x1="21" y1="14" x2="3" y2="14"></line>
                    <line x1="21" y1="18" x2="3" y2="18"></line>
                </svg>
            ),
        },
    ];



    return (
        <div className="flex flex-wrap items-center gap-x-1 sm:gap-x-1.5 gap-y-2 p-2 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">




            {/* Formatting Group */}
            <div className="flex items-center gap-0.5 sm:gap-1">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={btnClass(editor.isActive('bold'))}
                    title="Bold"
                >
                    <Bold size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={btnClass(editor.isActive('italic'))}
                    title="Italic"
                >
                    <Italic size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className={btnClass(editor.isActive('underline'))}
                    title="Underline"
                >
                    <UnderlineIcon size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={btnClass(editor.isActive('strike'))}
                    title="Strikethrough"
                >
                    <Strikethrough size={15} />
                </button>
            </div>

            <div className="w-[1px] h-4 bg-gray-200 mx-0.5 hidden md:block"></div>

            {/* Alignment Group */}
            <div className="flex items-center gap-0.5 sm:gap-1">
                {alignments.map((align) => (
                    <button
                        key={align.value}
                        type="button"
                        onClick={() => {
                            editor.chain().focus().setTextAlign(align.value).run();
                        }}
                        className={btnClass(editor.isActive({ textAlign: align.value }))}
                        title={`Align ${align.value}`}
                    >
                        {align.icon}
                    </button>
                ))}
            </div>

            <div className="w-[1px] h-4 bg-gray-200 mx-0.5 hidden md:block"></div>

            {/* Lists & Quotes */}
            <div className="flex items-center gap-0.5 sm:gap-1">

                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={btnClass(editor.isActive('codeBlock'))}
                    title="Code Block"
                >
                    <Code size={15} />
                </button>
            </div>

            <div className="w-[1px] h-4 bg-gray-200 mx-0.5 hidden md:block"></div>

            {/* Subscript & Superscript */}
            <div className="flex items-center gap-0.5 sm:gap-1">
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                    className={btnClass(editor.isActive('subscript'))}
                    title="Subscript"
                >
                    <SubIcon size={15} />
                </button>
                <button
                    type="button"
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    className={btnClass(editor.isActive('superscript'))}
                    title="Superscript"
                >
                    <SuperIcon size={15} />
                </button>
            </div>

            <div className="w-[1px] h-4 bg-gray-200 mx-0.5 hidden md:block"></div>

            {/* Colors */}
            <div className="flex items-center gap-0.5 sm:gap-1">
                <div className="relative flex items-center" title="Text Color">
                    <button type="button" className={btnClass(false)}>
                        <Baseline size={15} />
                    </button>
                    <input
                        type="color"
                        onInput={(e) =>
                            editor
                                .chain()
                                .focus()
                                .setColor((e.target as HTMLInputElement).value)
                                .run()
                        }
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>
                <div className="relative flex items-center" title="Highlight Color">
                    <button type="button" className={btnClass(false)}>
                        <Highlighter size={15} />
                    </button>
                    <input
                        type="color"
                        onInput={(e) =>
                            editor
                                .chain()
                                .focus()
                                .setHighlight({ color: (e.target as HTMLInputElement).value })
                                .run()
                        }
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>
            </div>

            <div className="w-[1px] h-4 bg-gray-200 mx-0.5 hidden md:block"></div>

            {/* Font Family Select */}
            <div className="relative flex items-center rounded px-1 min-w-[100px]">
                <select
                    className="text-xs bg-transparent outline-none p-1 pr-4 appearance-none cursor-pointer w-full font-medium text-gray-700"
                    onChange={(e) =>
                        editor.chain().focus().setFontFamily(e.target.value).run()
                    }
                >
                    <option value="Inter">Sans Serif</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                </select>
                <ChevronDown
                    size={12}
                    className="absolute right-1 pointer-events-none text-gray-400"
                />
            </div>

            {(showMediaButtons || showLinkButton) && (
                <>
                    <div className="w-[1px] h-4 bg-gray-200 mx-0.5 hidden md:block"></div>

                    <div className="flex items-center gap-0.5 sm:gap-1">

                        {/* Image Upload */}
                        {showMediaButtons && (
                            <>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                />

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className={btnClass(false)}
                                    title="Upload Images"
                                >
                                    <ImageIcon size={15} />
                                </button>
                            </>
                        )}

                        {/* Link */}
                        {showLinkButton && (
                            <button
                                type="button"
                                onMouseDown={(e) => {
                                    // Preserve the editor selection when clicking the toolbar.
                                    e.preventDefault();
                                }}
                                onClick={openLinkModal}
                                className={btnClass(editor.isActive("link"))}
                                title="Add Hyperlink"
                            >
                                <LinkIcon size={15} />
                            </button>
                        )}



                    </div>
                </>
            )}

            <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>

            {/* Actions */}
            <button
                type="button"
                onMouseDown={(e) => {
                    // Keep the selected text selected when clicking the toolbar.
                    e.preventDefault();
                }}
                onClick={deleteSelectedText}
                className="p-1.5 rounded text-red-400 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer flex items-center justify-center shrink-0 active:scale-90"
                title="Delete selected text"
            >
                <Trash2 size={15} />
            </button>
            {isLinkModalOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
                        onClick={closeLinkModal}
                    />

                    {/* Close button outside modal */}
                    <button
                        type="button"
                        onClick={closeLinkModal}
                        className="absolute top-[calc(50%-205px)] left-1/2 -translate-x-1/2 translate-y-[-50%] z-[100001] w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <X size={18} />
                    </button>

                    {/* Modal */}
                    <div className="relative z-[100000] w-[calc(100%-32px)] max-w-[530px] bg-white rounded-xl shadow-2xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-200">
                            <LinkIcon
                                size={18}
                                className="text-gray-800"
                            />

                            <h2 className="text-[15px] font-semibold text-gray-900">
                                Insert Link
                            </h2>
                        </div>

                        {/* Body */}
                        <div className="px-5 py-5">
                            {/* Text */}
                            <div className="mb-5">
                                <label className="block text-[13px] font-medium text-gray-800 mb-2">
                                    Text
                                </label>

                                <input
                                    type="text"
                                    value={linkText}
                                    onChange={(e) => {
                                        setLinkText(e.target.value);
                                        setLinkError("");
                                    }}
                                    placeholder="Enter text"
                                    className="w-full h-11 px-3.5 rounded-lg border border-gray-300 outline-none text-sm text-gray-800 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all"
                                />
                            </div>

                            {/* URL */}
                            <div>
                                <label className="block text-[13px] font-medium text-gray-800 mb-2">
                                    URL Address
                                </label>

                                <input
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => {
                                        setLinkUrl(e.target.value);
                                        setLinkError("");
                                    }}
                                    placeholder="https://example.com"
                                    autoFocus
                                    className={`w-full h-11 px-3.5 rounded-lg border outline-none text-sm text-gray-800 transition-all ${linkError
                                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                        : "border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10"
                                        }`}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            insertLink();
                                        }
                                    }}
                                />

                                <p className="mt-2 text-[11px] text-gray-500">
                                    Make sure to include http:// or https://
                                </p>

                                {linkError && (
                                    <p className="mt-1.5 text-[11px] text-red-500">
                                        {linkError}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeLinkModal}
                                className="min-w-[120px] h-10 px-5 rounded-lg border border-[#2563EB] text-gray-800 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={insertLink}
                                className="min-w-[160px] h-10 px-5 rounded-lg bg-[#2563EB] text-white text-sm font-medium hover:bg-[#1D4ED8] transition-colors cursor-pointer"
                            >
                                Insert Link
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MenuBar;