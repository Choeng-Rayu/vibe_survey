import SurveyCreationPage, {
  createStarterSurvey,
} from "@/app/feature/creeate_survey/pages/survey_creation_page";

export default function SurveyBuilderDemo() {
  return <SurveyCreationPage initialSurvey={createStarterSurvey()} />;
}
