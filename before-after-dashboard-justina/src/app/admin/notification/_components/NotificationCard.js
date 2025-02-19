import { Bell, Trash2 } from "lucide-react";
import moment from "moment";

export default function NotificationCard({ notification }) { 
  return (
    <div
      className={`flex items-center justify-between px-3 py-4 rounded-xl  gap-x-5 bg-demin-primary-${
        !notification?.read ? "100" : "50"
      } `}
    >
      <Bell size={40} />

      <div>
        <p className="text-xl text-[22px] font-semibold">
          {notification.message}
        </p>
        <p className="text-md"> {notification.description}</p>
      </div>

      <p className="text-dark font-bold ml-3">
        {moment(notification.createdAt).startOf("hour").fromNow()}
      </p>

      {/* <button>
          <Trash2 size={18} color="#F16365" />
        </button> */}
    </div>
  );
}
