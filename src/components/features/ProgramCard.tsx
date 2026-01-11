import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Program } from "@/content/types";
import { LuxuryCard } from "@/components/ui/LuxuryCard";
import { Button } from "@/components/ui/Button";

interface ProgramCardProps {
    program: Program;
}

export function ProgramCard({ program }: ProgramCardProps) {
    return (
        <LuxuryCard className="flex flex-col h-full hover:-translate-y-2 transition-transform duration-500">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-display text-2xl font-bold text-brand-dark">{program.title}</h3>
                <span className="bg-blush/30 text-brand-dark px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
                    {program.ages}
                </span>
            </div>

            <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
                {program.description}
            </p>

            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="text-sm font-medium text-gray-400">
                    Contact for Pricing
                </div>
                <Link href="/contact" className="group flex items-center gap-2 text-brand font-medium hover:text-brand-dark transition-colors">
                    Book Trial <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>
        </LuxuryCard>
    );
}
