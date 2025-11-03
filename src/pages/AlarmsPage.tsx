import { TTSAlarmPage } from "@/components/TTSAlarmPage";

interface AlarmsPageProps {
  isPremium: boolean;
  onPremiumUpgrade: () => void;
}

export default function AlarmsPage({ isPremium, onPremiumUpgrade }: AlarmsPageProps) {
  return <TTSAlarmPage isPremium={isPremium} onPremiumUpgrade={onPremiumUpgrade} />;
}