import { TTSAlarmPage } from "@/components/TTSAlarmPage";

interface AlarmsPageProps {
  isPremium: boolean;
}

export default function AlarmsPage({ isPremium }: AlarmsPageProps) {
  return <TTSAlarmPage isPremium={isPremium} />;
}