"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    enterprise: {
        code: 'enterprise',
        name: 'jsreport enterprise perpetual',
        infoLine: 'perpetual license - fully featured single server instance with no limitations',
        price: {
            usd: 895
        },
        permalink: 'XOxVq',
        email: {
            checkoutText: `
        Do you need commercial support with SLA? Please check our support products <a href='https://jsreport.net/buy/support'>here</a>.
      `
        },
        promoteSupport: true,
        upgrade: {
            code: 'enterpriseUpgrade'
        }
    },
    enterpriseScale: {
        code: 'enterpriseScale',
        name: 'jsreport enterprise scale perpetual',
        infoLine: 'perpetual license - fully featured infinite amount of server instances with no limitations',
        price: {
            usd: 2495
        },
        permalink: 'onQk',
        email: {
            checkoutText: `
        Do you need commercial support with SLA? Please check our support products <a href='https://jsreport.net/buy/support'>here</a>.
      `
        },
        promoteSupport: true,
        upgrade: {
            code: 'enterpriseScaleUpgrade'
        }
    },
    enterpriseSubscription: {
        code: 'enterpriseSubscription',
        name: 'jsreport enterprise subscription',
        infoLine: 'subscription - fully featured single server instance with no limitations',
        price: {
            usd: 395
        },
        isSubscription: true,
        permalink: 'SBwu',
        email: {
            checkoutText: `
        Do you need commercial support with SLA? Please check our support products <a href='https://jsreport.net/buy/support'>here</a>.
      `,
            cancelText: `          
          The license key will be active until \${moment(product.subscription.nextPayment).format('MM/DD/YYYY')}.
          Since then the license key becomes invalid and server instances using it won't start. <br /><br />
          You can also reactive the license in the future using the link/button bellow.
      `
        },
        promoteSupport: true
    },
    enterpriseScaleSubscription: {
        code: 'enterpriseScaleSubscription',
        name: 'jsreport enterprise scale subscription',
        infoLine: 'subscription - fully featured infinite amount of server instances with no limitations',
        price: {
            usd: 1295
        },
        isSubscription: true,
        permalink: 'SrfG',
        email: {
            checkoutText: `
        Do you need commercial support with SLA? Please check our support products <a href='https://jsreport.net/buy/support'>here</a>.
      `,
            cancelText: `          
          The license key will be active until \${moment(product.subscription.nextPayment).format('MM/DD/YYYY')}.
          Since then the license key becomes invalid and server instances using it won't start. <br /><br />
          You can also reactive the license in the future using the link/button bellow.
      `
        },
        promoteSupport: true
    },
    supportSubscription: {
        code: 'supportSubscription',
        name: 'jsreport enterprise support subscription',
        infoLine: 'enterprise support service provided with the next business day response time',
        price: {
            usd: 895
        },
        hasLicenseKey: false,
        isSupport: true,
        isSubscription: true,
        permalink: 'SVEKk',
        emailType: 'support',
        email: {
            checkoutText: `Please register to the support portal <a href='https://support.jsreport.net'>https://support.jsreport.net</a> and follow the instructions.<br>
      <br>
      You can also use email support@jsreport.net for support questions and incidents.
      However, the support portal is the preferred way to contact us.
      Please always mention your're support subscriber in case you decide to use the email.`
        }
    },
    supportStarter: {
        code: 'supportStarter',
        name: 'jsreport enterprise support starter',
        infoLine: 'enterprise support service valid for 2 months provided with the next business day response time',
        price: {
            usd: 395
        },
        hasLicenseKey: false,
        isSupport: true,
        permalink: 'DUeSe',
        email: {
            checkoutText: `Please register to the support portal <a href='https://support.jsreport.net'>https://support.jsreport.net</a> and follow the instructions.<br>
      <br>
      You can also use email support@jsreport.net for support questions and incidents.
      However, the support portal is the preferred way to contact us.
      Please always mention your're support subscriber in case you decide to use the email.`
        }
    },
    enterpriseDiscounted: {
        code: 'enterpriseDiscounted',
        name: 'jsreport enterprise perpetual',
        infoLine: 'perpetual license - fully featured single server instance with no limitations',
        price: {
            usd: 1
        },
        permalink: 'XOxVq'
    },
    enterpriseSubscriptionDiscounted: {
        code: 'enterpriseSubscriptionDiscounted',
        name: 'jsreport enterprise subscription',
        infoLine: 'subscription - fully featured single server instance with no limitations',
        price: {
            usd: 1
        },
        isSubscription: true,
        permalink: 'SBwu',
        emailType: 'enterprise'
    },
    enterpriseUpgrade: {
        code: 'enterpriseUpgrade',
        name: 'jsreport enterprise upgrade',
        infoLine: 'Upgrade an existing jsreport enterprise license key to be eligible to the current the latest version and another 6 months of free updates.',
        price: {
            usd: 495
        },
        hasLicenseKey: false,
        permalink: 'NCCKu',
        emailType: 'custom',
        isUpgrade: true,
        description: 'Your license was upgraded and you may update to the latest jsreport released during the next 6 months.',
        email: {
            checkoutText: `
        Your license key is updated now and you should be able to use the latest jsreport and the updates released during the next 6 months.
        Please contact us if have any issues with the update.
      `
        }
    },
    enterpriseScaleUpgrade: {
        code: 'enterpriseScaleUpgrade',
        name: 'jsreport enterprise scale upgrade',
        infoLine: 'Upgrade an existing jsreport enterprise scale license key to be eligible to the current the latest version and another 6 months of free updates.',
        price: {
            usd: 1395
        },
        hasLicenseKey: false,
        permalink: 'NCCKA',
        emailType: 'custom',
        isUpgrade: true,
        description: 'Your license was upgraded and you may update to the latest jsreport released during the next 6 months.',
        email: {
            checkoutText: `
        Your license key is updated now and you should be able to use the latest jsreport and the updates released during the next 6 months.
        Please contact us if have any issues with the update.
      `
        }
    },
    enterpriseToScaleUpgrade: {
        code: 'enterpriseToScaleUpgrade',
        name: 'jsreport enterprise to scale upgrade',
        infoLine: 'Upgrade an existing jsreport enterprise license key eligible to the single instance to the scale license eligible for infinite amount of licenses.',
        price: {
            usd: 1350
        },
        hasLicenseKey: false,
        permalink: 'YYYYy',
        emailType: 'custom'
    },
    supportSubscriptionWithScaleUpdates: {
        code: 'supportSubscriptionWithScaleUpdates',
        name: 'enterprise support subscription including updates',
        infoLine: 'enterprise support service provided with the next business day response time and including software updates to a purchased perpetual license',
        price: {
            usd: 1390
        },
        hasLicenseKey: false,
        isSupport: true,
        isSubscription: true,
        permalink: 'XXXXx',
        emailType: 'enterprise'
    },
    jsreportonline: {
        code: 'jsreportonline',
        name: 'jsreportonline subscription',
        isSubscription: true,
        monthly: true,
        webhook: 'https://jsreportonline.net/payments-hook',
        hasLicenseKey: false,
        email: {
            checkoutText: `Your plan change was propagated and you can now get back to the jsreportonline and use the new credits limit.
      You will be automatically charged \${product.subscription.paymentCycle} at this date.
      `,
            cancelText: 'Your plan was changed to the free. You can continue using the jsreportonline service with limited credits.'
        },
        plans: {
            bronze: {
                name: 'bronze',
                infoLine: '10 000 credits every month',
                paymentCycles: {
                    monthly: {
                        price: {
                            usd: 29.95
                        }
                    },
                    yearly: {
                        price: {
                            usd: 300
                        }
                    }
                }
            },
            silver: {
                name: 'silver',
                infoLine: '100 000 credits every month',
                paymentCycles: {
                    monthly: {
                        price: {
                            usd: 99.95
                        }
                    },
                    yearly: {
                        price: {
                            usd: 1000
                        }
                    }
                }
            },
            gold: {
                name: 'gold',
                infoLine: '300 000 credits every month',
                paymentCycles: {
                    monthly: {
                        price: {
                            usd: 299.95
                        }
                    },
                    yearly: {
                        price: {
                            usd: 3000
                        }
                    }
                }
            }
        }
    }
};
//# sourceMappingURL=products.js.map