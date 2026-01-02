export const PASTEL_GRADIENTS = [
    "from-pink-300 via-purple-300 to-indigo-400",
    "from-indigo-300 via-purple-300 to-pink-400",
    "from-green-300 via-emerald-300 to-teal-400",
    "from-blue-300 via-cyan-300 to-teal-400",
    "from-yellow-300 via-orange-300 to-red-400",
    "from-rose-300 via-pink-300 to-purple-400",
    "from-teal-300 via-green-300 to-lime-400",
    "from-violet-300 via-purple-300 to-fuchsia-400",
];

export function getProjectGradient(id: string) {
    if (!id) return PASTEL_GRADIENTS[0];

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % PASTEL_GRADIENTS.length;
    return PASTEL_GRADIENTS[index];
}
