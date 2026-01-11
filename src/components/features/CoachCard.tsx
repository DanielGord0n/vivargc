import Image from "next/image";
import { Coach } from "@/content/types";
import { LuxuryCard } from "@/components/ui/LuxuryCard";

interface CoachCardProps {
    coach: Coach;
}

export function CoachCard({ coach }: CoachCardProps) {
    return (
        <LuxuryCard className="overflow-hidden p-0 border-0 group">
            <div className="relative h-80 w-full overflow-hidden">
                <Image
                    src={coach.image}
                    alt={coach.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-display text-2xl font-bold mb-1">{coach.name}</h3>
                    <p className="text-blush font-medium text-sm uppercase tracking-wide">{coach.role}</p>
                </div>
            </div>

            <div className="p-6">
                <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                    {coach.bio}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {coach.specialties.map((spec) => (
                        <span key={spec} className="bg-gray-50 text-gray-500 text-xs px-2 py-1 rounded-md border border-gray-100">
                            {spec}
                        </span>
                    ))}
                </div>

                <ul className="space-y-1">
                    {coach.credentials.slice(0, 2).map((cred) => (
                        <li key={cred} className="flex items-center gap-2 text-xs text-brand/80">
                            <div className="h-1 w-1 rounded-full bg-brand" />
                            {cred}
                        </li>
                    ))}
                </ul>
            </div>
        </LuxuryCard>
    );
}
