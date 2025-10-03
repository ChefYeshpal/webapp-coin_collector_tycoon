// Achievement System
class AchievementManager {
    constructor() {
        this.achievements = {
            oneSelling: {
                bigSpender: {
                id: 'bigSpender',
                name: 'Big Spender',
                description: 'Buy 50 bottles filled with filtered water',
                unlocked: false,
                icon: '🛍️',
                progress: 0,
                target: 50
            },     id: 'oneSelling',
                name: 'One Bottle Wonder',
                description: 'Sell exactly one bottle',
                unlocked: false,
                icon: '🍼',
                progress: 0,
                target: 1
            },
            firstProfit: {
                id: 'firstProfit',
                name: 'First Profit',
                description: 'Make your first profit in a day',
                unlocked: false,
                icon: '💰',
                progress: 0,
                target: 1
            },
            totalProfit: {
                id: 'totalProfit',
                name: 'In The Green',
                description: 'Have positive total profit',
                unlocked: false,
                icon: '📈',
                progress: 0,
                target: 1
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
            riverWaterViscount: {
                id: 'riverWaterViscount',
                name: 'River Water Viscount',
                description: 'Sell 300 river water bottles',
                unlocked: false,
                icon: '🌊',
                progress: 0,
                target: 300
            },
            riverWaterEarl: {
                id: 'riverWaterEarl',
                name: 'River Water Earl',
                description: 'Sell 700 river water bottles',
                unlocked: false,
                icon: '🌊',
                progress: 0,
                target: 700
            },
            riverWaterDuke: {
                id: 'riverWaterDuke',
                name: 'River Water Duke',
                description: 'Sell 1000 river water bottles',
                unlocked: false,
                icon: '🌊',
                progress: 0,
                target: 1000
            },
            riverWaterKing: {
                id: 'riverWaterKing',
                name: 'River Water King',
                description: 'Sell 1500 river water bottles',
                unlocked: false,
                icon: '🌊',
                progress: 0,
                target: 1500
            },
            filteredWaterBaron: {
                id: 'filteredWaterBaron',
                name: 'Filtered Water Baron',
                description: 'Sell 100 filtered water bottles',
                unlocked: false,
                icon: '💧',
                progress: 0,
                target: 100
            },
            filteredWaterViscount: {
                id: 'filteredWaterViscount',
                name: 'Filtered Water Viscount',
                description: 'Sell 300 filtered water bottles',
                unlocked: false,
                icon: '💧',
                progress: 0,
                target: 300
            },
            filteredWaterEarl: {
                id: 'filteredWaterEarl',
                name: 'Filtered Water Earl',
                description: 'Sell 700 filtered water bottles',
                unlocked: false,
                icon: '💧',
                progress: 0,
                target: 700
            },
            filteredWaterDuke: {
                id: 'filteredWaterDuke',
                name: 'Filtered Water Duke',
                description: 'Sell 1000 filtered water bottles',
                unlocked: false,
                icon: '💧',
                progress: 0,
                target: 1000
            },
            filteredWaterKing: {
                id: 'filteredWaterKing',
                name: 'Filtered Water King',
                description: 'Sell 1500 filtered water bottles',
                unlocked: false,
                icon: '💧',
                progress: 0,
                target: 1500
            },
            survivor: {
                id: 'survivor',
                name: 'Survivor',
                description: 'Survive 30 days',
                unlocked: false,
                icon: '🏆',
                progress: 0,
                target: 30
            },
            profiteer: {
                id: 'profiteer',
                name: 'Profiteer',
                description: 'Get profit for 10 consecutive days',
                unlocked: false,
                icon: '⭐',
                progress: 0,
                target: 10
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
                icon: '✨',
                progress: 0,
                target: 1
            },
            qualityBuilder: {
                id: 'qualityBuilder',
                name: 'Quality Builder',
                description: 'Use filtered water for 5 consecutive days',
                unlocked: false,
                icon: '🏗️',
                progress: 0,
                target: 5
            },
            reputationMaster: {
                id: 'reputationMaster',
                name: 'Reputation Master',
                description: 'Reach 20% reputation bonus',
                unlocked: false,
                icon: '👑',
                progress: 0,
                target: 20
            },
            trustedBrand: {
                id: 'trustedBrand',
                name: 'Trusted Brand',
                description: 'Maintain 30% reputation bonus',
                unlocked: false,
                icon: '🏆',
                progress: 0,
                target: 30
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
        let newProgress = achievement.progress;

        switch (id) {
            case 'oneSelling':
                if (extraData && extraData.bottlesSold === 1) {
                    newProgress = 1;
                    shouldUnlock = true;
                }
                break;
            case 'firstProfit':
                if (extraData && extraData.dayProfit > 0) {
                    newProgress = 1;
                    shouldUnlock = true;
                }
                break;
            case 'totalProfit':
                if (gameState && gameState.totalProfit > 0) {
                    newProgress = 1;
                    shouldUnlock = true;
                }
                break;
            case 'survivor':
                if (gameState) {
                    newProgress = gameState.day;
                    shouldUnlock = gameState.day >= 30;
                }
                break;
            case 'profiteer':
                if (gameState) {
                    newProgress = gameState.consecutiveProfitDays;
                    shouldUnlock = gameState.consecutiveProfitDays >= 10;
                }
                break;
            case 'bigSpender':
                if (gameState && gameState.waterType === 'filtered') {
                    newProgress = gameState.bottlesBought;
                    shouldUnlock = gameState.bottlesBought >= 50;
                }
                break;
            case 'perfectDay':
                if (extraData && extraData.bottlesSold === extraData.totalBottles && extraData.totalBottles > 0) {
                    newProgress = 1;
                    shouldUnlock = true;
                }
                break;
            case 'qualityBuilder':
                if (gameState && gameState.consecutiveFilteredDays) {
                    newProgress = gameState.consecutiveFilteredDays;
                    shouldUnlock = gameState.consecutiveFilteredDays >= 5;
                }
                break;
            case 'reputationMaster':
                if (gameState && gameState.reputationBonus) {
                    newProgress = gameState.reputationBonus;
                    shouldUnlock = gameState.reputationBonus >= 20;
                }
                break;
            case 'trustedBrand':
                if (gameState && gameState.reputationBonus) {
                    newProgress = gameState.reputationBonus;
                    shouldUnlock = gameState.reputationBonus >= 30;
                }
                break;
        }

        // Update progress
        if (newProgress !== achievement.progress) {
            achievement.progress = newProgress;
            this.saveAchievements();
        }

        if (shouldUnlock) {
            this.unlockAchievement(id);
            return true;
        }
        return false;
    }

    updateRiverWaterProgress(amount) {
        // List of all river water achievements in order
        const riverWaterAchievements = [
            'riverWaterBaron',
            'riverWaterViscount', 
            'riverWaterEarl',
            'riverWaterDuke',
            'riverWaterKing'
        ];
        
        // Update progress for all river water achievements
        riverWaterAchievements.forEach(id => {
            const achievement = this.achievements[id];
            if (achievement && !achievement.unlocked) {
                achievement.progress += amount;
                
                if (achievement.progress >= achievement.target) {
                    this.unlockAchievement(id);
                }
            }
        });
        
        this.saveAchievements();
    }

    updateFilteredWaterProgress(amount) {
        // List of all filtered water achievements in order
        const filteredWaterAchievements = [
            'filteredWaterBaron',
            'filteredWaterViscount', 
            'filteredWaterEarl',
            'filteredWaterDuke',
            'filteredWaterKing'
        ];
        
        // Update progress for all filtered water achievements
        filteredWaterAchievements.forEach(id => {
            const achievement = this.achievements[id];
            if (achievement && !achievement.unlocked) {
                achievement.progress += amount;
                
                if (achievement.progress >= achievement.target) {
                    this.unlockAchievement(id);
                }
            }
        });
        
        this.saveAchievements();
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
        
        // Update filtered water progress if applicable
        if (salesData.filteredWaterSold > 0) {
            this.updateFilteredWaterProgress(salesData.filteredWaterSold);
        }
        
        // Check other achievements
        this.checkAchievement('totalProfit', gameState);
        this.checkAchievement('survivor', gameState);
        this.checkAchievement('profiteer', gameState);
        
        // Check reputation achievements
        this.checkAchievement('qualityBuilder', gameState);
        this.checkAchievement('reputationMaster', gameState);
        this.checkAchievement('trustedBrand', gameState);
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

        filteredWaterBaron: () => {
            window.achievementManager.updateFilteredWaterProgress(100);
            console.log('🧪 Tested filtered water baron');
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
