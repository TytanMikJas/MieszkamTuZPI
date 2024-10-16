import AnnouncementsList from 'src/pages/map/map-with-sidepanels/announcements/AnnouncementsList';
import AnnouncementSorting from 'src/pages/map/map-with-sidepanels/announcements/AnnouncementSorting';
import { useEffect } from "react";
import { useAnnouncementStore } from "@/core/stores/announcement-store";

type Props = object;

function AnnouncementsPage({}: Props) {
  const { resetList, setResetList } = useAnnouncementStore();
  useEffect(() => {
    if (!resetList) return;
    setResetList(false);
    window.location.reload();
  }, [resetList]);
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row justify-around p-3">
        <AnnouncementSorting />
      </div>
      <AnnouncementsList />
    </div>
  );
}

export default AnnouncementsPage;
