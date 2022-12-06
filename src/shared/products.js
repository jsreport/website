export default {
  enterprise: {
    code: 'enterprise',
    name: 'jsreport enterprise perpetual',
    infoLine: 'perpetual license - fully featured single server instance with no limitations',
    price: {
      usd: 645
    },
    permalink: 'XOxVq',
    emailType: 'enterprise'
  },
  enterpriseScale: {
    code: 'enterpriseScale',
    name: 'jsreport enterprise scale perpetual',
    infoLine: 'perpetual license - fully featured infinite amount of server instances with no limitations',
    price: {
      usd: 1995
    },
    permalink: 'onQk',
    emailType: 'enterprise'
  },
  enterpriseSubscription: {
    code: 'enterpriseSubscription',
    name: 'jsreport enterprise subscription',
    infoLine: 'subscription - fully featured single server instance with no limitations',
    price: {
      usd: 295
    },
    isSubscription: true,
    permalink: 'SBwu',
    emailType: 'enterprise'
  },
  enterpriseScaleSubscription: {
    code: 'enterpriseScaleSubscription',
    name: 'jsreport enterprise scale subscription',
    infoLine: 'subscription - fully featured infinite amount of server instances with no limitations',
    price: {
      usd: 995
    },
    isSubscription: true,
    permalink: 'SrfG',
    emailType: 'enterprise'
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
    emailType: 'support'
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
    emailType: 'support'
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
      usd: 445
    },
    hasLicenseKey: false,
    permalink: 'NCCKu',
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
    webhook: 'http://local.net/payments-hook',
    hasLicenseKey: false,
    emailType: 'custom',
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
}
