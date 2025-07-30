import { Users } from "lucide-react";

const SidebarSkeleton = () => {
  const skeletonContacts = Array(8).fill(null);

  return (
    <aside
      className="h-full w-full lg:w-72 border-r border-base-300 
      flex flex-col transition-all duration-200 bg-white"
    >
      {/* Header */}
      <div className="border-b border-base-300 w-full px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <span className="font-semibold hidden lg:block text-base">Contacts</span>
        </div>
        <div className="skeleton h-8 w-28 rounded-md lg:hidden" />
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full divide-y divide-gray-100">
        {skeletonContacts.map((_, idx) => (
          <div key={idx} className="flex items-center gap-3 px-4 py-3">
            {/* Avatar */}
            <div className="skeleton rounded-full w-10 h-10" />

            {/* Infos utilisateur visible tout le temps */}
            <div className="flex-1 min-w-0">
              <div className="skeleton h-4 w-32 mb-1" />
              <div className="skeleton h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SidebarSkeleton;
