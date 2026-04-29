export const apps = [
  // { id: 'app-ecommerce', name: 'E-Commerce Platform', description: 'Main customer facing store' },
  // { id: 'app-admin', name: 'Admin Dashboard', description: 'Internal admin tools' },
  // { id: 'app-mobile', name: 'Mobile App API', description: 'API for mobile clients' },
  // { id: 'app-analytics', name: 'Analytics Engine', description: 'Data processing pipeline' },
];

export const modules = [
  // { id: 'mod-auth', name: 'Auth Module', description: 'User authentication and authorization' },
  // { id: 'mod-payment', name: 'Payment Gateway', description: 'Stripe and PayPal integration' },
  // { id: 'mod-inventory', name: 'Inventory Core', description: 'Stock management logic' },
  // { id: 'mod-notifications', name: 'Notification Service', description: 'Email and Push notifications' },
  // { id: 'mod-logger', name: 'Logging Service', description: 'Centralized logging' },
];

// Relationships: source (App) consumes target (Module)
// OR source (App) provides target (Module) - Wait, user said "App can be provide module"
// Let's model it as generic dependencies. 
// For visualization, we can simple have edges.
// If App USES Module: App -> Module
// If App PROVIDES Module: Module -> App (in a "Belongs To" sense?) or just App "owns" Module?
// User said: "app can be provide module or app --> consume module"
// Let's assume standard dependency direction: Consumer -> Provider.
// So:
// App -> Module (App consumes module)
// Module -> App (Module provided by App? Or maybe just keep it simple: App uses Module)

// User also said: "relationship between app and module is many to many"
// This implies Apps use Modules, and Modules are used by Apps.

export const relationships = [
  // E-Commerce uses:
  { source: 'app-ecommerce', target: 'mod-auth' },
  { source: 'app-ecommerce', target: 'mod-payment' },
  { source: 'app-ecommerce', target: 'mod-inventory' },
  { source: 'app-ecommerce', target: 'mod-logger' },

  // Admin Dashboard uses:
  { source: 'app-admin', target: 'mod-auth' },
  { source: 'app-admin', target: 'mod-inventory' }, // Shared with E-Commerce
  { source: 'app-admin', target: 'mod-notifications' },
  { source: 'app-admin', target: 'mod-logger' },

  // Mobile App uses:
  { source: 'app-mobile', target: 'mod-auth' },
  { source: 'app-mobile', target: 'mod-payment' },
  { source: 'app-mobile', target: 'mod-logger' },

  // Analytics uses:
  { source: 'app-analytics', target: 'mod-logger' },
];