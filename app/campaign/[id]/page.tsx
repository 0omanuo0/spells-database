import Link from 'next/link';


export default function CampainHomepage({ params }: { params: { id: string}}) {
    return (
        <div>
            <h1>campain homepage</h1>
            <Link href={`/campaign/${params.id}/editor `}>Editor</Link>
        </div>
    )
}