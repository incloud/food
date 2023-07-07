export const en = {
  translation: {
    common: {
      errors: {
        notFound: {
          message: 'Not found',
          description: 'We could not find the selected element.',
        },
        unknown: {
          message: 'An Error Occured',
          description: 'It might help to try again.',
        },
      },
      buttons: {
        submit: 'Submit',
        cancel: 'Cancel',
      },
      created: 'Created',
      createdAt: '$t(common.created) at',
      createdBy: '$t(common.created) by',
      updated: 'Last updated',
      updatedAt: '$t(common.updated) at',
      updatedBy: '$t(common.updated) by',
      lottery: 'Lottery',
      event: 'Event',
      event_plural: 'Events',
      name: 'Name',
      no: 'No',
      order: 'Order',
      restaurant: 'Restaurant',
      restaurant_plural: 'Restaurants',
      restaurantDescription: {
        address: 'Address',
        comment: 'Comment',
        delivery: 'Delivery possible',
        phone: 'Phone',
        website: 'Website',
      },
      site: 'Site',
      site_plural: 'Sites',
      webhook: 'Webhook',
      webhook_plural: 'Webhooks',
      yes: 'Yes',
      dark: 'dark',
      light: 'light',
      switchColorMode: 'Switch to {{colorMode}} mode',
      url: 'URL',
    },
    components: {
      defaultLayout: {
        footer: {
          github: 'View on GitHub',
          gqlPlayground: 'Open GraphQL Playground',
        },
      },
      error: {
        goHome: 'Go home?',
        unknownPage: '$t(common.errors.errorMessage) Reload?',
        retry: 'Retry',
      },
      restaurantSelect: {
        dropdownPlaceholder: 'Select a $t(common.restaurant, lowercase)',
      },
      siteSelect: {
        dropdownPlaceholder: 'Select a $t(common.site, lowercase)',
      },
      siteWarning:
        'This {{type, lowercase}} is not at your currently selected site!',
      layout: {
        greeting: 'Hello {{name}}!',
        loginButton: 'Login',
      },
    },
    pages: {
      events: {
        eventForm: {
          description: 'Description',
          nameLabel: 'Name',
          nameRequiredMessage: 'Please enter a name',
          restaurantLabel: '$t(common.restaurant)',
          restaurantRequiredMessage:
            'Please select a $t(common.restaurant, lowercase)',
          activeLabel: 'Active',
        },
        eventDetail: {
          eventOrderForm: {
            textLabel: '$t(common.order)',
            textRequiredMessage:
              'Please enter your $t(common.order, lowercase)',
            availableForLotteryLabel:
              'Are you available to place the $t(common.order, lowercase)? One person will be randomly selected to do this.',
          },
          eventDescriptions: {
            title: 'Information',
            statusLabel: 'Status',
            statusActive: '$t(common.event) is active',
            statusClosed: '$t(common.event) is already closed',
            lotteryWinner: '{{name}} was selected for ordering',
            description: 'Description',
          },
          participantList: {
            title: 'Participants',
          },
          errors: {
            deleteOrder: 'Could not delete your $t(common.order, lowercase)!',
            lottery: 'Could not start $t(common.lottery, lowercase)!',
          },
          addOrder: 'Add $t(common.order)',
          startLottery: 'Start $t(common.lottery)',
          deleteOrderTitle: 'Not hungry anymore?',
          deleteOrderOkButton: 'Yes',
          deleteOrderCancelButton: 'No',
          editEvent: 'Edit event',
        },
        eventList: {
          title: '$t(common.event_plural)',
          searchPlaceholder: 'Name',
          createEventButton: 'Create $t(common.event)',
          loadMoreButton: 'Load More',
          gotoButton: 'Go to event',
        },
      },
      restaurantDetail: {
        edit: 'Edit restaurant',
        delete: 'Delete restaurant',
        deleteConfirmation: 'Do you really want to delete this restaurant?',
        deleted: 'This restaurant was deleted',
        deleteSuccess: {
          message: 'The restaurant was successfully deleted.',
        },
      },
      restaurantList: {
        createRestaurantButton: 'Create $t(common.restaurant)',
      },
      siteList: {
        createSiteButton: 'Create $t(common.site)',
      },
      siteDetail: {
        editButton: 'Edit $(common.site)',
      },
    },
  },
};
