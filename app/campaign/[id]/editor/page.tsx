import DrawingCanvas from "@/components/tableCanvas/editor";


export default function Editor({params}: {params: {id: string}}) {
    return (
        <div className="">
            <h1>Editor</h1>
            <DrawingCanvas /> 
        </div>
    )
}