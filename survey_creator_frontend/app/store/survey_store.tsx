import { Survey } from "../feature/creeate_survey/types/survey";
import { create } from "zustand";

type SurveyStore = {
  survey: Survey;
  updateSurvey: (updatedSurvey: Survey) => void;
};

export const useSurveyStore = create<SurveyStore>((set) => ({
  survey: {
    id: "",
    title: "",
    description: "",
    status: "draft",
    questions: [],
    randomizeQuestionOrder: false,
    attentionChecks: false,
  },
  updateSurvey: (updatedSurvey: Survey) => set({ survey: updatedSurvey }),
}));
