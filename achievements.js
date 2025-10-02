// Achievement System
class AchievementManager {
    constructor() {
        this.achievements = {
            firstProfit: {
                id: 'firstProfit',
                name: 'First Profit',
                description: 'Make your first profitable day',
                unlocked: false,
                icon: '💰'
            },
            riverWaterBaron: {
                id: 'riverWaterBaron',
                name: 'River Water Baron',
                description: 'Sell 100 river water bottles',
                unlocked: false,
                icon: '🌊',
                progress: 0,
                target: 100
            },
            premiumSeller: {
                id: 'premiumSeller',
                name: 'Premium Seller',
                description: 'Achieve 5 consecutive profitable days',
                unlocked: false,
                icon: '⭐'
            },
            survivor: {
                id: 'survivor',
                name: 'Survivor',
                description: 'Survive 30 days',
                unlocked: false,
                icon: '🏆'
            },
            bigSpender: {
                id: 'bigSpender',
                name: 'Big Spender',
                description: 'Buy 50 bottles in a single day',
                unlocked: false,
                icon: '🛒'
            },
            entrepreneur: {
                id: 'entrepreneur',
                name: 'Entrepreneur',
                description: 'Reach ₹500 total money',
                unlocked: false,
                icon: '💼'
            },
            highRoller: {
                id: 'highRoller',
                name: 'High Roller',
                description: 'Set bottle price above ₹10',
                unlocked: false,
                icon: '💎'
            },
            bargainHunter: {
                id: 'bargainHunter',
                name: 'Bargain Hunter',
                description: 'Sell bottles for ₹1 or less',
                unlocked: false,
                icon: '🏷️'
            },
            perfectDay: {
                id: 'perfectDay',
                name: 'Perfect Day',
                description: 'Sell all bottles in a single day',
                unlocked: false,
                icon: '✨'
            },
            comeback: {
                id: 'comeback',
                name: 'Comeback',
                description: 'Make profit after 3 consecutive loss days',
                unlocked: false,
                icon: '📈'
            }
        };
        
        this.initializeNotificationContainer();
        this.loadAchievements();
    }

    initializeNotificationContainer() {
        // Create notification container
        const container = document.createElement('div');
        container.id = 'achievement-notifications';
        container.className = 'achievement-notifications';
        document.body.appendChild(container);
    }

    saveAchievements() {
        const saveData = {};
        for (const [key, achievement] of Object.entries(this.achievements)) {
            saveData[key] = {
                unlocked: achievement.unlocked,
                progress: achievement.progress || 0
            };
        }
        localStorage.setItem('waterBottleTycoon_achievements', JSON.stringify(saveData));
    }

    loadAchievements() {
        const saved = localStorage.getItem('waterBottleTycoon_achievements');
        if (saved) {
            try {
                const saveData = JSON.parse(saved);
                for (const [key, data] of Object.entries(saveData)) {
                    if (this.achievements[key]) {
                        this.achievements[key].unlocked = data.unlocked;
                        if (data.progress !== undefined) {
                            this.achievements[key].progress = data.progress;
                        }
                    }
                }
            } catch (e) {
                console.warn('Failed to load achievements:', e);
            }
        }
    }

    checkAchievement(id, gameState = null) {
        const achievement = this.achievements[id];
        if (!achievement || achievement.unlocked) return false;

        let shouldUnlock = false;

        switch (id) {
            case 'firstProfit':
                shouldUnlock = gameState && gameState.totalProfit > 0;
                break;
            case 'premiumSeller':
                shouldUnlock = gameState && gameState.consecutiveProfitDays >= 5;
                break;
            case 'survivor':
                shouldUnlock = gameState && gameState.day >= 30;
                break;
            case 'bigSpender':
                shouldUnlock = gameState && gameState.bottlesBought >= 50;
                break;
            case 'entrepreneur':
                shouldUnlock = gameState && gameState.money >= 500;
                break;
            case 'highRoller':
                shouldUnlock = gameState && gameState.sellingPrice > 10;
                break;
            case 'bargainHunter':
                shouldUnlock = gameState && gameState.sellingPrice > 0 && gameState.sellingPrice <= 1;
                break;
            case 'comeback':
                shouldUnlock = gameState && gameState.consecutiveLossDays === 0 && 
                             gameState.totalProfit > (gameState.previousTotalProfit || 0) &&
                             gameState.wasInLossStreak;
                break;
        }

        if (shouldUnlock) {
            this.unlockAchievement(id);
            return true;
        }
        return false;
    }

    updateProgress(id, amount, gameState = null) {
        const achievement = this.achievements[id];
        if (!achievement || achievement.unlocked) return;

        if (achievement.progress !== undefined) {
            achievement.progress += amount;
            
            if (achievement.target && achievement.progress >= achievement.target) {
                this.unlockAchievement(id);
            }
        }
    }

    checkPerfectDay(bottlesSold, totalBottles) {
        if (bottlesSold === totalBottles && totalBottles > 0) {
            this.checkAchievement('perfectDay');
        }
    }

    unlockAchievement(id) {
        const achievement = this.achievements[id];
        if (!achievement || achievement.unlocked) return;

        achievement.unlocked = true;
        this.saveAchievements();
        this.showNotification(achievement);
    }

    showNotification(achievement) {
        const container = document.getElementById('achievement-notifications');
        
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <div class="achievement-title">Achievement Unlocked</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.description}</div>
            </div>
        `;

        container.appendChild(notification);

        // Trigger slide-in animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Call this method to check all relevant achievements
    checkAllAchievements(gameState) {
        // Track previous state for comeback achievement
        if (gameState.consecutiveLossDays === 0 && gameState.previousConsecutiveLossDays >= 3) {
            gameState.wasInLossStreak = true;
        }

        // Check individual achievements
        this.checkAchievement('firstProfit', gameState);
        this.checkAchievement('premiumSeller', gameState);
        this.checkAchievement('survivor', gameState);
        this.checkAchievement('bigSpender', gameState);
        this.checkAchievement('entrepreneur', gameState);
        this.checkAchievement('highRoller', gameState);
        this.checkAchievement('bargainHunter', gameState);
        this.checkAchievement('comeback', gameState);
    }

    getUnlockedCount() {
        return Object.values(this.achievements).filter(a => a.unlocked).length;
    }

    getTotalCount() {
        return Object.keys(this.achievements).length;
    }
}

// Global achievement manager instance
window.achievementManager = new AchievementManager();