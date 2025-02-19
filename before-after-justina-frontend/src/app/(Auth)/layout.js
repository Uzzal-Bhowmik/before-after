import ResponsiveContainer from "@/components/ResponsiveContainer/ResponsiveContainer";

export default function AuthLayout({ children }) {
  return (
    <ResponsiveContainer classes="min-h-[75vh] flex-center">
      <div className="w-full sm:w-11/12 md:w-3/4 lg:w-1/2 xl:w-[40%] 3xl:w-1/3">
        {children}
      </div>
    </ResponsiveContainer>
  );
}
