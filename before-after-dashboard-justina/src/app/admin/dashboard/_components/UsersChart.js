"use client";

import { DatePicker, Select } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import dayjs from "dayjs";

 

const UsersChart = ({ monthlyUsers, setJoinYear, setRole, role }) => { 
  return (
    <div className="rounded-xl p-6 w-full xl:w-1/2 bg-demin-primary-50/75">
      <div className="flex lg:flex-wrap xl:flex-nowrap justify-between items-center mb-10 gap-2">
        <h1 className="text-xl font-medium">Users Overview</h1>

        <div className="space-x-3">
          <Select
            value={role}
            style={{
              width: 120,
              marginLeft: "5px",
            }}
            onChange={(e) => setRole(e?.target?.value)}
            options={[
              { value: "customer", label: "Customer" },
              { value: "serviceProvider", label: "Service Provider" },
            ]}
          />

          <DatePicker
            onChange={(date, dateString) =>
              setJoinYear(moment(dateString).format("YYYY"))
            }
            picker="year"
            defaultValue={dayjs()}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={monthlyUsers}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
          barSize={20}
        >
          <XAxis
            dataKey="month"
            scale="point"
            padding={{ left: 10, right: 10 }}
            tickMargin={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis axisLine={false} tickLine={false} tickMargin={20} />

          <Tooltip
            formatter={(value) => [`Monthly Users Joined: ${value}`]}
            contentStyle={{
              color: "var(--primary-green)",
              fontWeight: "500",
              borderRadius: "5px",
              border: "0",
            }}
          />

          <CartesianGrid
            opacity={0.2}
            horizontal={true}
            vertical={false}
            stroke="#080E0E"
            strokeDasharray="3 3"
          />

          <Bar
            barSize={18}
            radius={5}
            background={false}
            dataKey="total"
            fill="#1B70A6"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsersChart;
