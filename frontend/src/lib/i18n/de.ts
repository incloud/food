import { en } from './en';

export const de: typeof en = {
  translation: {
    common: {
      errors: {
        pageHeader: 'Ein Fehler ist aufgetreten',
        notFound: {
          message: 'Nicht gefunden',
          description: 'Wir konnten das ausgewählte Element nicht finden.',
        },
        unknown: {
          message: 'Ein Fehler ist aufgetreten',
          description: 'Es könnte helfen die Aktion erneut auszuführen.',
        },
      },
      buttons: {
        submit: 'Absenden',
        cancel: 'Abbrechen',
      },
      created: 'Erstellt',
      createdAt: '$t(common.created) um',
      createdBy: '$t(common.created) von',
      updated: 'Aktualisiert',
      updatedAt: '$t(common.updated) um',
      updatedBy: '$t(common.updated) von',
      lottery: 'Auslosung',
      event: 'Event',
      event_plural: 'Events',
      name: 'Name',
      no: 'Nein',
      order: 'Bestellung',
      restaurant: 'Restaurant',
      restaurant_plural: 'Restaurants',
      restaurantDescription: {
        address: 'Adresse',
        comment: 'Anmerkungen',
        delivery: 'Lieferung möglich',
        phone: 'Telefon',
        website: 'Webseite',
      },
      site: 'Standort',
      site_plural: 'Standorte',
      webhook: 'Webhook',
      webhook_plural: 'Webhooks',
      yes: 'Ja',
      dark: 'Dark',
      light: 'Light',
      switchColorMode: 'Zum $t(common.{{colorMode}}) Mode wechseln',
      url: 'URL',
    },
    components: {
      defaultLayout: {
        footer: {
          github: 'Auf GitHub ansehen',
          gqlPlayground: 'GraphQL Playground öffnen',
        },
      },
      error: {
        goHome: 'Zurück zur Startseite?',
        unknownPage: '$t(common.errors.unknown.description) Seite neu laden?',
        retry: 'Seite neu laden',
      },
      restaurantSelect: {
        dropdownPlaceholder: 'Wähle ein $t(common.restaurant)',
      },
      siteSelect: {
        dropdownPlaceholder: 'Wähle einen $t(common.site)',
      },
      siteWarning:
        'Dieses {{type}} befindet sich nicht an Ihrem aktuell ausgewählten Standort!',
      layout: {
        greeting: 'Hallo {{name}}!',
        loginButton: 'Einloggen',
      },
    },
    pages: {
      events: {
        eventForm: {
          description: 'Beschreibung',
          nameLabel: 'Name',
          nameRequiredMessage: 'Bitte gib einen Namen an',
          restaurantLabel: '$t(common.restaurant)',
          restaurantRequiredMessage:
            'Bitte wähle ein $t(common.restaurant) aus',
          activeLabel: 'Aktiv',
        },
        eventDetail: {
          eventOrderForm: {
            addOrderTitle: '$t(common.order) hinzufügen',
            editOrderTitle: 'Edit $t(common.order) bearbeiten',
            textLabel: '$t(common.order)',
            textRequiredMessage: 'Bitte gib deine $t(common.order) ein',
            availableForLotteryHint:
              'Kannst du die $t(common.order) aufgeben? Eine Person wird zufällig ausgewählt, um die $t(common.order) aufzugeben.',
            availableForLotteryLabel: 'Verfügbar für $t(common.lottery)',
          },
          eventDescriptions: {
            title: 'Informationen',
            statusLabel: 'Status',
            statusActive: '$t(common.event) ist aktiv',
            statusClosed: '$t(common.event) wurde bereits geschlossen',
            lotteryWinner: '{{name}} wurde zum Bestellen ausgewählt',
            description: 'Beschreibung',
          },
          participantList: {
            title: 'Teilnehmer',
          },
          errors: {
            deleteOrder: '$t(common.order) konnte nicht gelöscht werden!',
            lottery: '$t(common.lottery) konnte nicht gestartet werden!',
            reactivateEvent:
              '$t(common.event) konnte nicht reaktiviert werden!',
          },
          addOrder: '$t(common.order) hinzufügen',
          startLottery: '$t(common.lottery) starten',
          deleteOrderTitle: 'Nicht mehr hungrig?',
          deleteOrderOkButton: 'Ja',
          deleteOrderCancelButton: 'Nein',
          editEvent: '$t(common.event) bearbeiten',
          reactivateEvent: '$t(common.event) reaktivieren',
          userLotteryRatioDescription:
            "Aktuelle $t(common.lottery)rate ist {{lotteryRatio}} ({{participateCount}} teilnahmen / {{hitCount}} '$t(common.lottery)ssiege')\n\nDer Teilnehmer mit der höchsten $t(common.lottery)rate innerhalb der $t(common.event)teilnehmer, die für die $t(common.lottery) verfügbar sind, 'gewinnt' die $t(common.lottery). Falls zwei Teilnehmer die gleiche Zahl haben wird es ausgewürfelt. Diese Funktion sorgt dafür dass jeder im selben Verhältnis ausgewählt wird.",
        },
        eventList: {
          title: 'Events',
          searchPlaceholder: 'Name',
          createEventButton: '$t(common.event) erstellen',
          loadMoreButton: 'Mehr laden',
          gotoButton: 'Zum $t(common.event)',
        },
      },
      restaurantDetail: {
        edit: 'Restaurant bearbeiten',
        delete: 'Restaurant löschen',
        deleteConfirmation: 'Wollen Sie dieses Restaurant wirklich löschen?',
        deleted: 'Dieses Restaurant wurde gelöscht!',
        deleteSuccess: {
          message: 'Das Restaurant wurde erfolgreich gelöscht.',
        },
      },
      restaurantList: {
        createRestaurantButton: '$t(common.restaurant) erstellen',
      },
      siteList: {
        createSiteButton: '$t(common.site) hinzufügen',
      },
      siteDetail: {
        editButton: '$t(common.site) bearbeiten',
      },
    },
  },
};
