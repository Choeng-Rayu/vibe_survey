// "use client";

// import type { Question, QuestionType } from "../types/question";
// import { useState } from "react";
// import { generateId } from "@/app/utils/id-generator";

// interface QuestionEditorProps {
//   question: Question;
//   onUpdateQuestion: (question: Question) => void;
// }

// export default function QuestionEditor({
//   question,
//   onUpdateQuestion,
// }: QuestionEditorProps) {
//   const [expandedSection, setExpandedSection] = useState<string>("general");

//   const handleUpdateField = (
//     field: string,
//     value: any
//   ) => {
//     onUpdateQuestion({
//       ...question,
//       [field]: value,
//     });
//   };

//   const handleUpdateOption = (optionId: string, text: string) => {
//     const updatedOptions = question.options?.map((opt: any) =>
//       opt.id === optionId ? { ...opt, text } : opt
//     );
//     onUpdateQuestion({
//       ...question,
//       options: updatedOptions,
//     });
//   };

//   const handleAddOption = () => {
//     const newOption = {
//       id: generateId(),
//       text: `Option ${(question.options?.length || 0) + 1}`,
//     };
//     onUpdateQuestion({
//       ...question,
//       options: [...(question.options || []), newOption],
//     });
//   };

//   const handleRemoveOption = (optionId: string) => {
//     const updatedOptions = question.options?.filter(
//       (opt: any) => opt.id !== optionId
//     );
//     onUpdateQuestion({
//       ...question,
//       options: updatedOptions,
//     });
//   };

//   const hasOptions =
//     question.questionType === "single-choice" ||
//     question.questionType === "multiple-choice" ||
//     question.questionType === "checkbox" ||
//     question.questionType === "image-choice" ||
//     question.questionType === "ranking";

//   return (
//     <div className="space-y-4 sticky top-8">
//       {/* General Settings */}
//       <Section
//         title="General"
//         isOpen={expandedSection === "general"}
//         onToggle={() => setExpandedSection("general")}
//       >
//         <div className="space-y-4">
//           <div>
//             <label
//               className="block text-xs font-medium mb-2"
//               style={{ color: "#1C1C1A" }}
//             >
//               Question Text
//             </label>
//             <textarea
//               value={question.questionText}
//               onChange={(e) =>
//                 handleUpdateField("questionText", e.target.value)
//               }
//               className="w-full px-3 py-2 rounded-lg text-sm border resize-none"
//               style={{
//                 backgroundColor: "#FFFFFF",
//                 borderColor: "#E8DFD5",
//                 color: "#1C1C1A",
//               }}
//               rows={3}
//             />
//           </div>

//           <div>
//             <label
//               className="block text-xs font-medium mb-2"
//               style={{ color: "#1C1C1A" }}
//             >
//               Description (Optional)
//             </label>
//             <textarea
//               value={question.description || ""}
//               onChange={(e) =>
//                 handleUpdateField("description", e.target.value)
//               }
//               className="w-full px-3 py-2 rounded-lg text-sm border resize-none"
//               style={{
//                 backgroundColor: "#FFFFFF",
//                 borderColor: "#E8DFD5",
//                 color: "#1C1C1A",
//               }}
//               rows={2}
//               placeholder="Help text or additional guidance"
//             />
//           </div>

//           <div className="flex items-center gap-3">
//             <input
//               type="checkbox"
//               id="required"
//               checked={question.required}
//               onChange={(e) =>
//                 handleUpdateField("required", e.target.checked)
//               }
//               className="rounded"
//             />
//             <label
//               htmlFor="required"
//               className="text-sm font-medium cursor-pointer"
//               style={{ color: "#1C1C1A" }}
//             >
//               Required Question
//             </label>
//           </div>
//         </div>
//       </Section>

//       {/* Options */}
//       {hasOptions && (
//         <Section
//           title="Options"
//           isOpen={expandedSection === "options"}
//           onToggle={() => setExpandedSection("options")}
//         >
//           <div className="space-y-3">
//             {question.options?.map((option: any, index: number) => (
//               <div key={option.id} className="flex gap-2">
//                 <input
//                   type="text"
//                   value={option.text}
//                   onChange={(e) =>
//                     handleUpdateOption(option.id, e.target.value)
//                   }
//                   className="flex-1 px-3 py-2 rounded-lg text-sm border"
//                   style={{
//                     backgroundColor: "#FFFFFF",
//                     borderColor: "#E8DFD5",
//                     color: "#1C1C1A",
//                   }}
//                   placeholder={`Option ${index + 1}`}
//                 />
//                 <button
//                   onClick={() => handleRemoveOption(option.id)}
//                   className="px-2 py-2 rounded-lg text-sm font-medium transition-colors"
//                   style={{
//                     backgroundColor: "#FFE8E8",
//                     color: "#D85555",
//                   }}
//                   onMouseEnter={(e) => {
//                     (e.currentTarget as HTMLButtonElement).style.backgroundColor =
//                       "#FFD9D9";
//                   }}
//                   onMouseLeave={(e) => {
//                     (e.currentTarget as HTMLButtonElement).style.backgroundColor =
//                       "#FFE8E8";
//                   }}
//                 >
//                   ✕
//                 </button>
//               </div>
//             ))}

//             <button
//               onClick={handleAddOption}
//               className="w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors border-2 border-dashed"
//               style={{
//                 backgroundColor: "#FFFFFF",
//                 borderColor: "#7C9E8A",
//                 color: "#7C9E8A",
//               }}
//               onMouseEnter={(e) => {
//                 (e.currentTarget as HTMLButtonElement).style.backgroundColor =
//                   "#F9F6F1";
//               }}
//               onMouseLeave={(e) => {
//                 (e.currentTarget as HTMLButtonElement).style.backgroundColor =
//                   "#FFFFFF";
//               }}
//             >
//               + Add Option
//             </button>

//             {(question.questionType === "single-choice" ||
//               question.questionType === "multiple-choice" ||
//               question.questionType === "checkbox") && (
//               <div className="flex items-center gap-2 pt-2">
//                 <input
//                   type="checkbox"
//                   id="randomize"
//                   checked={question.randomizeOptions || false}
//                   onChange={(e) =>
//                     handleUpdateField("randomizeOptions", e.target.checked)
//                   }
//                   className="rounded"
//                 />
//                 <label
//                   htmlFor="randomize"
//                   className="text-xs font-medium cursor-pointer"
//                   style={{ color: "#6B6860" }}
//                 >
//                   Randomize option order
//                 </label>
//               </div>
//             )}
//           </div>
//         </Section>
//       )}

//       {/* Text Settings */}
//       {(question.questionType === "short-text" ||
//         question.questionType === "long-text") && (
//         <Section
//           title="Text Settings"
//           isOpen={expandedSection === "text"}
//           onToggle={() => setExpandedSection("text")}
//         >
//           <div>
//             <label
//               className="block text-xs font-medium mb-2"
//               style={{ color: "#1C1C1A" }}
//             >
//               Character Limit (Optional)
//             </label>
//             <input
//               type="number"
//               value={question.charLimit || ""}
//               onChange={(e) =>
//                 handleUpdateField(
//                   "charLimit",
//                   e.target.value ? parseInt(e.target.value) : undefined
//                 )
//               }
//               className="w-full px-3 py-2 rounded-lg text-sm border"
//               style={{
//                 backgroundColor: "#FFFFFF",
//                 borderColor: "#E8DFD5",
//                 color: "#1C1C1A",
//               }}
//               placeholder="No limit"
//               min="1"
//             />
//           </div>
//         </Section>
//       )}

//       {/* Scale Settings */}
//       {(question.questionType === "rating-scale-5" ||
//         question.questionType === "rating-scale-10" ||
//         question.questionType === "slider") && (
//         <Section
//           title="Scale Settings"
//           isOpen={expandedSection === "scale"}
//           onToggle={() => setExpandedSection("scale")}
//         >
//           <div className="space-y-3">
//             <div>
//               <label
//                 className="block text-xs font-medium mb-2"
//                 style={{ color: "#1C1C1A" }}
//               >
//                 Min Label
//               </label>
//               <input
//                 type="text"
//                 value={question.minLabel || ""}
//                 onChange={(e) =>
//                   handleUpdateField("minLabel", e.target.value)
//                 }
//                 className="w-full px-3 py-2 rounded-lg text-sm border"
//                 style={{
//                   backgroundColor: "#FFFFFF",
//                   borderColor: "#E8DFD5",
//                   color: "#1C1C1A",
//                 }}
//                 placeholder="e.g., Very Bad"
//               />
//             </div>
//             <div>
//               <label
//                 className="block text-xs font-medium mb-2"
//                 style={{ color: "#1C1C1A" }}
//               >
//                 Max Label
//               </label>
//               <input
//                 type="text"
//                 value={question.maxLabel || ""}
//                 onChange={(e) =>
//                   handleUpdateField("maxLabel", e.target.value)
//                 }
//                 className="w-full px-3 py-2 rounded-lg text-sm border"
//                 style={{
//                   backgroundColor: "#FFFFFF",
//                   borderColor: "#E8DFD5",
//                   color: "#1C1C1A",
//                 }}
//                 placeholder="e.g., Very Good"
//               />
//             </div>
//           </div>
//         </Section>
//       )}
//     </div>
//   );
// }

// interface SectionProps {
//   title: string;
//   isOpen: boolean;
//   onToggle: () => void;
//   children: React.ReactNode;
// }

// function Section({ title, isOpen, onToggle, children }: SectionProps) {
//   return (
//     <div
//       className="rounded-2xl border overflow-hidden"
//       style={{
//         backgroundColor: "#FFFFFF",
//         borderColor: "#E8DFD5",
//       }}
//     >
//       <button
//         onClick={onToggle}
//         className="w-full px-4 py-3 flex items-center justify-between font-medium text-sm transition-colors"
//         style={{
//           color: "#1C1C1A",
//           borderBottom: isOpen ? "1px solid #E8DFD5" : "none",
//         }}
//         onMouseEnter={(e) => {
//           (e.currentTarget as HTMLButtonElement).style.backgroundColor =
//             "#F9F6F1";
//         }}
//         onMouseLeave={(e) => {
//           (e.currentTarget as HTMLButtonElement).style.backgroundColor =
//             "#FFFFFF";
//         }}
//       >
//         <span>{title}</span>
//         <span
//           style={{
//             transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
//             transition: "transform 0.2s",
//             color: "#7C9E8A",
//           }}
//         >
//           ▼
//         </span>
//       </button>

//       {isOpen && (
//         <div className="px-4 py-4 space-y-4">{children}</div>
//       )}
//     </div>
//   );
// }
