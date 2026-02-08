import { cn } from '@/lib/utils'

export const Logo = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md" />
                <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative w-8 h-8 text-primary"
                >
                    <path
                        d="M16 2L2 9V23L16 30L30 23V9L16 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M16 8V24M8 12L24 20M24 12L8 20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <circle cx="16" cy="16" r="3" fill="currentColor" />
                </svg>
            </div>
            <span className="text-xl font-black tracking-tighter uppercase text-white">
                Unit<span className="text-primary">-01</span>
            </span>
        </div>
    )
}

export const LogoIcon = ({ className, uniColor }: { className?: string; uniColor?: boolean }) => {
    return (
        <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn('size-6 text-primary', className)}
        >
            <path
                d="M16 2L2 9V23L16 30L30 23V9L16 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path
                d="M16 8V24M8 12L24 20M24 12L8 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <circle cx="16" cy="16" r="3" fill="currentColor" />
        </svg>
    )
}

export const LogoStroke = ({ className }: { className?: string }) => {
    return (
        <div className={cn("flex items-center gap-2 opacity-50", className)}>
             <LogoIcon className="size-5" />
             <span className="text-sm font-black tracking-tighter uppercase">U1-SYS</span>
        </div>
    )
}
