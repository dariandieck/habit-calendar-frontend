export function LoadingBar() {
    return (
        <div className="mt-8 w-48 h-1.5 bg-pink-100 rounded-full overflow-hidden m-auto">
            <div className="h-full bg-linear-to-r from-pink-300 to-purple-300 w-1/2
                        rounded-full animate-[shimmer_2s_infinite] origin-left"></div>
        </div>
    )
}