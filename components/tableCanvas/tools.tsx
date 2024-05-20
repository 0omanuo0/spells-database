import { Tool, Path } from "./editor";


export function ToolsCanvas(
    { setCurrentTool, setCurrentColor }: { setCurrentTool: (tool: Tool) => void, setCurrentColor: (color: string) => void }
) {
    return (
        <div className='space-x-4 items-center flex' >
            <button
                onClick={() => setCurrentTool(Tool.Pen)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Pen
            </button>
            <button
                onClick={() => setCurrentTool(Tool.Eraser)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Eraser
            </button>
            <button
                onClick={() => setCurrentTool(Tool.Selector)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                selector
            </button>
            <input
                type="color"
                onChange={
                    (e) => setCurrentColor(e.target.value)
                }
                className="px-2 py-1 h-full bg-blue-500 text-white rounded"
            />
        </div>
    )
}

export function RemoveToolsCanvas(
    { removeLastPath, setPaths, paths }: { removeLastPath: () => void, setPaths: (paths: Path[]) => void, paths: Path[] }
) {
    return (
        <div className='flex space-x-4'>
            <button
                onClick={removeLastPath}
                className="px-4 py-2 bg-red-500 text-white rounded"
            >
                Remove Last Path
            </button>
            <button
                onClick={() => setPaths([])}
                className="px-4 py-2 bg-red-500 text-white rounded"
            >
                Clear All
            </button>
            <button
                onClick={() => {
                    const newPaths = paths.filter(path => !path.selected);
                    setPaths(newPaths);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded"
            >
                Remove selected
            </button>
        </div>
    )
}