import Link from "next/link";

type VideoCardProps = {
    name: string;
};

export function VideoCard({ name }: VideoCardProps) {
    return (
        <div className="border rounded p-4 hover:shadow-md transition">
            <h2 className="text-xl font-semibold mb-2">{name}</h2>
            <Link
                href={`/video/${name}`}
                className="text-blue-600 hover:underline"
            >
                Смотреть
            </Link>
        </div>
    );
}