
import { Eye, Download, Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

interface ActionProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMore?: () => void;
  onDownload?: () => void;
  viewIconSize?: number;
  editIconSize?: number;
  deleteIconSize?: number;
  moreIconSize?: number;
  downloadIconSize?: number;
  viewButtonClassName?: string;
  editButtonClassName?: string;
  deleteButtonClassName?: string;
  moreButtonClassName?: string;
  downloadButtonClassName?: string;
  containerClassName?: string;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showMore?: boolean;
  showDownload?: boolean;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  viewIcon?: ReactNode;
  editIcon?: ReactNode;
  deleteIcon?: ReactNode;
  moreIcon?: ReactNode;
  downloadIcon?: ReactNode;
  viewTitle?: string;
  editTitle?: string;
  deleteTitle?: string;
  moreTitle?: string;
  downloadTitle?: string;
}

export default function Action({
  onView,
  onEdit,
  onDelete,
  onDownload,
  viewIconSize = 16,
  editIconSize = 16,
  deleteIconSize = 16,
  downloadIconSize = 18,
  viewButtonClassName = "p-2 cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-[8px] transition-all border border-gray-200",
  editButtonClassName = "p-2 cursor-pointer text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-[8px] transition-all border border-gray-200",
  deleteButtonClassName = "p-2 cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-[8px] transition-all border border-gray-200",
   downloadButtonClassName = "p-2.5 cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-[10px] transition-all border border-gray-200",
  containerClassName = "flex items-center justify-center gap-1.5",
  showView = true,
  showEdit = true,
  showDelete = true,
  showDownload = false,
  viewLabel,
  editLabel,
  deleteLabel,
  viewIcon,
  editIcon,
  deleteIcon,
  downloadIcon,
  viewTitle,
  editTitle,
  deleteTitle,
  downloadTitle,
}: ActionProps) {
  return (
    <div className={containerClassName}>
      {showView && (
        <button
          onClick={onView}
          className={`${viewButtonClassName} ${viewLabel ? '!py-1 !px-3' : ''}`}
          title={viewTitle || viewLabel || "View"}
        >
          {viewLabel ? (
            <span className="text-[13.5px] font-medium">{viewLabel}</span>
          ) : (
            viewIcon || <Eye size={viewIconSize} />
          )}
        </button>
      )}
      
      {showEdit && (
        <button
          onClick={onEdit}
          className={`${editButtonClassName} ${editLabel ? '!py-1 !px-3' : ''}`}
          title={editTitle || editLabel || "Edit"}
        >
          {editLabel ? (
            <span className="text-[13.5px] font-medium">{editLabel}</span>
          ) : (
            editIcon || <Pencil size={editIconSize} />
          )}
        </button>
      )}
      
      {showDelete && (
        <button
          onClick={onDelete}
          className={`${deleteButtonClassName} ${deleteLabel ? '!py-1 !px-3' : ''}`}
          title={deleteTitle || deleteLabel || "Delete"}
        >
          {deleteLabel ? (
            <span className="text-[13.5px] font-medium">{deleteLabel}</span>
          ) : (
            deleteIcon || <Trash2 size={deleteIconSize} />
          )}
        </button>
      )}
      
      {showDownload && (
        <button
          onClick={onDownload}
          className={downloadButtonClassName}
          title={downloadTitle || "Download"}
        >
          {downloadIcon || <Download size={downloadIconSize} />}
        </button>
      )}
      
      
    </div>
  );
}