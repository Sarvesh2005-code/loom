export default function WorkspaceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen w-full overflow-hidden">
            {/* 
         We might want a specific header here or just full screen for canvas. 
         Transcript suggests: "create a layout or a route group to share the layout between all of these elements."
      */}
            {children}
        </div>
    );
}
