import { en } from './en';

export const de: typeof en = {
  translation: {
    common: {
      errors: {
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
      updated: 'Zuletzt aktualisiert',
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
      yes: 'Ja',
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
            textLabel: 'Text',
            textRequiredMessage: 'Bitte gib deine $t(common.order) ein',
            availableForLotteryLabel:
              'Kannst du die $t(common.order) aufgeben? Eine Person wird zufällig ausgewählt, um die $t(common.order) aufzugeben.',
          },
          eventDescriptions: {
            statusLabel: 'Status',
            statusActive: '$t(common.event) ist aktiv',
            statusClosed: '$t(common.event) wurde bereits geschlossen',
            lotteryWinner: '{{name}} wurde zum Bestellen ausgewählt',
          },
          errors: {
            deleteOrder: '$t(common.order) konnte nicht gelöscht werden!',
            lottery: '$t(common.lottery) konnte nicht gestartet werden!',
          },
          addOrder: '$t(common.order) hinzufügen',
          startLottery: '$t(common.lottery) starten',
          deleteOrderTitle: 'Nicht mehr hungrig?',
          deleteOrderOkButton: 'Ja',
          deleteOrderCancelButton: 'Nein',
        },
        eventList: {
          title: 'Events',
          searchPlaceholder: 'Name',
          createEventButton: '$t(common.event) erstellen',
          loadMoreButton: 'Mehr laden',
        },
      },
      restaurantDetail: {
        deleteConfirmation: 'Wollen Sie dieses Restaurant wirklich löschen?',
        deleted: 'Dieses Restaurant wurde gelöscht!',
        deleteSuccess: {
          message: 'Das Restaurant wurde erfolgreich gelöscht.',
        },
      },
      restaurantList: {
        createRestaurantButton: '$t(common.restaurant) erstellen',
      },
    },
  },
};
