/**
 * Maps tier numbers to their corresponding colors
 * 1 = Bronze, 2 = Silver, 3 = Gold, 4 = Platinum, 5 = Diamond
 */
export const TIER_COLORS = {
    1: "#CD7F32", // Bronze
    2: "#C0C0C0", // Silver  
    3: "#FFD700", // Gold
    4: "#E5E4E2", // Platinum
    5: "#B9F2FF", // Diamond
} as const;

/**
 * Gets the color for a given tier number
 * @param tier - The tier number (1-5)
 * @returns The hex color string for the tier
 */
export function getTierColor(tier: number): string {
    // Default to bronze if tier is invalid or not provided
    if (!tier || tier < 1 || tier > 5) {
        return TIER_COLORS[1]; // Bronze as default
    }

    return TIER_COLORS[tier as keyof typeof TIER_COLORS];
}

/**
 * Gets the tier name from tier number
 * @param tier - The tier number (1-5)
 * @returns The tier name
 */
export function getTierName(tier: number): string {
    const tierNames = {
        1: "Bronze",
        2: "Silver",
        3: "Gold",
        4: "Platinum",
        5: "Diamond",
    } as const;

    if (!tier || tier < 1 || tier > 5) {
        return "Bronze"; // Default
    }

    return tierNames[tier as keyof typeof tierNames];
}