import type { Schema, Struct } from '@strapi/strapi';

export interface SharedBullet extends Struct.ComponentSchema {
  collectionName: 'components_shared_bullets';
  info: {
    displayName: 'Bullet';
    icon: 'list-ul';
  };
  attributes: {
    text: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.bullet': SharedBullet;
    }
  }
}
