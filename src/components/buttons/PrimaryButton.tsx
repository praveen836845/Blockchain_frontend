import { cn } from '@/lib/utils'
import { ComponentProps } from 'react'

interface PrimaryButtonProps extends ComponentProps<'button'> {
    
}

const PrimaryButton = ({ className, children, ...props }: PrimaryButtonProps) => {
    
    return (
        <button className={cn("bg-[#FF66BE] text-white py-2 px-4 rounded-md", className)} {...props}>
            {children}
        </button>
    )
}

export default PrimaryButton