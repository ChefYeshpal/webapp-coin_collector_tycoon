// Achievement System
class AchievementManager {
    constructor() {
        this.achievements = {
            oneSelling: {
                id: 'oneSelling',
                name: 'One Bottle Wonder',
                description: 'Sell exactly one bottle',
                unlocked: false,
                icon: '🍼'
            },
            firstProfit: {
                id: 'firstProfit',
                name: 'First Profit',
                description: 'Make your first profit in a day',
                unlocked: false,
                icon: '💰'
            },
            totalProfit: {
                id: 'totalProfit',
                name: 'In The Green',
                description: 'Have positive total profit',
                unlocked: false,
                icon: '📈'
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
            survivor: {
                id: 'survivor',
                name: 'Survivor',
                description: 'Survive 30 days',
                unlocked: false,
                icon: '🏆'
            },
            profiteer: {
                id: 'profiteer',
                name: 'Profiteer',
                description: 'Get profit for 10 consecutive days',
                unlocked: false,
                icon: '⭐'
            },
            bigSpender: {
                id: 'bigSpender',
                name: 'Big Spender',
                description: 'Buy 50 bottles filled with filtered water',
                unlocked: false,
                icon: '🛒'
            },
            perfectDay: {
                id: 'perfectDay',
                name: 'Perfect Day',
                description: 'Sell all bottles in a single day',
                unlocked: false,
                icon: '✨'
            }
        };
        
        this.initializeNotificationContainer();
        this.loadAchievements();
    }

    initializeNotificationContainer() {
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

    checkAchievement(id, gameState = null, extraData = null) {
        const achievement = this.achievements[id];
        if (!achievement || achievement.unlocked) return false;

        let shouldUnlock = false;

        switch (id) {
            case 'oneSelling':
                shouldUnlock = extraData && extraData.bottlesSold === 1;
                break;
            case 'firstProfit':
                shouldUnlock = extraData && extraData.dayProfit > 0;
                break;
            case 'totalProfit':
                shouldUnlock = gameState && gameState.totalProfit > 0;
                break;
            case 'survivor':
                shouldUnlock = gameState && gameState.day >= 30;
                break;
            case 'profiteer':
                shouldUnlock = gameState && gameState.consecutiveProfitDays >= 10;
                break;
            case 'bigSpender':
                shouldUnlock = gameState && gameState.bottlesBought >= 50 && gameState.waterType === 'filtered';
                break;
            case 'perfectDay':
                shouldUnlock = extraData && extraData.bottlesSold === extraData.totalBottles && extraData.totalBottles > 0;
                break;
        }

        if (shouldUnlock) {
            this.unlockAchievement(id);
            return true;
        }
        return false;
    }

    updateRiverWaterProgress(amount) {
        const achievement = this.achievements.riverWaterBaron;
        if (!achievement.unlocked) {
            achievement.progress += amount;
            
            if (achievement.progress >= achievement.target) {
                this.unlockAchievement('riverWaterBaron');
            }
            this.saveAchievements();
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

    // Main method to check achievements after sales
    checkSalesAchievements(gameState, salesData) {
        // Check one selling
        this.checkAchievement('oneSelling', gameState, salesData);
        
        // Check first profit
        this.checkAchievement('firstProfit', gameState, salesData);
        
        // Check perfect day
        this.checkAchievement('perfectDay', gameState, salesData);
        
        // Update river water progress if applicable
        if (salesData.riverWaterSold > 0) {
            this.updateRiverWaterProgress(salesData.riverWaterSold);
        }
        
        // Check other achievements
        this.checkAchievement('totalProfit', gameState);
        this.checkAchievement('survivor', gameState);
        this.checkAchievement('profiteer', gameState);
    }

    // Check achievements after buying bottles
    checkPurchaseAchievements(gameState) {
        this.checkAchievement('bigSpender', gameState);
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

// Console Testing Functions
window.testAchievements = {
    // Show all achievements status
    list: () => {
        console.log('\n=== ACHIEVEMENTS STATUS ===');
        for (const [id, achievement] of Object.entries(window.achievementManager.achievements)) {
            const status = achievement.unlocked ? '✅' : '❌';
            let progressText = '';
            if (achievement.progress !== undefined) {
                progressText = ` (${achievement.progress}/${achievement.target})`;
            }
            console.log(`${status} ${achievement.name}${progressText} - ${achievement.description}`);
        }
        console.log(`\nTotal: ${window.achievementManager.getUnlockedCount()}/${window.achievementManager.getTotalCount()}`);
    },

    // Unlock a specific achievement
    unlock: (achievementId) => {
        if (window.achievementManager.achievements[achievementId]) {
            window.achievementManager.unlockAchievement(achievementId);
            console.log(`✅ Unlocked: ${window.achievementManager.achievements[achievementId].name}`);
        } else {
            console.log(`❌ Achievement '${achievementId}' not found`);
            console.log('Available IDs:', Object.keys(window.achievementManager.achievements));
        }
    },

    // Unlock all achievements
    unlockAll: () => {
        let count = 0;
        for (const id of Object.keys(window.achievementManager.achievements)) {
            if (!window.achievementManager.achievements[id].unlocked) {
                window.achievementManager.unlockAchievement(id);
                count++;
            }
        }
        console.log(`✅ Unlocked ${count} achievements`);
    },

    // Reset all achievements
    reset: () => {
        for (const achievement of Object.values(window.achievementManager.achievements)) {
            achievement.unlocked = false;
            if (achievement.progress !== undefined) {
                achievement.progress = 0;
            }
        }
        window.achievementManager.saveAchievements();
        console.log('🔄 All achievements reset');
    },

    // Test specific achievements
    test: {
        oneSelling: () => {
            const salesData = { bottlesSold: 1, dayProfit: 5, totalBottles: 10, riverWaterSold: 0 };
            window.achievementManager.checkSalesAchievements(window.gameState, salesData);
            console.log('🧪 Tested one selling');
        },
        
        firstProfit: () => {
            const salesData = { bottlesSold: 5, dayProfit: 10, totalBottles: 10, riverWaterSold: 0 };
            window.achievementManager.checkSalesAchievements(window.gameState, salesData);
            console.log('🧪 Tested first profit');
        },
        
        perfectDay: () => {
            const salesData = { bottlesSold: 10, dayProfit: 20, totalBottles: 10, riverWaterSold: 0 };
            window.achievementManager.checkSalesAchievements(window.gameState, salesData);
            console.log('🧪 Tested perfect day');
        },
        
        riverWaterBaron: () => {
            window.achievementManager.updateRiverWaterProgress(100);
            console.log('🧪 Tested river water baron');
        },

        testAll: () => {
            console.log('🧪 Testing all achievements...');
            window.testAchievements.test.oneSelling();
            window.testAchievements.test.firstProfit();
            window.testAchievements.test.perfectDay();
            window.testAchievements.test.riverWaterBaron();
            window.testAchievements.unlock('totalProfit');
            window.testAchievements.unlock('survivor');
            window.testAchievements.unlock('profiteer');
            window.testAchievements.unlock('bigSpender');
            console.log('✅ All tests completed');
        }
    }
};
