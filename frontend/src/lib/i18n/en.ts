export const en = {
  translation: {
    common: {
      errors: {
        pageHeader: 'An Error occurred',
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
            addOrderTitle: 'Add $t(common.order)',
            editOrderTitle: 'Edit $t(common.order)',
            textLabel: '$t(common.order)',
            textRequiredMessage:
              'Please enter your $t(common.order, lowercase)',
            availableForLotteryHint:
              'Are you available to place the $t(common.order, lowercase)? One person will be randomly selected to do this.',
            availableForLotteryLabel:
              'Available for $t(common.lottery, lowercase)',
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
            reactivateEvent:
              'Could not reactivate $t(common.event, lowercase)!',
          },
          addOrder: 'Add $t(common.order, lowercase)',
          startLottery: 'Start $t(common.lottery, lowercase)',
          deleteOrderTitle: 'Not hungry anymore?',
          deleteOrderOkButton: 'Yes',
          deleteOrderCancelButton: 'No',
          editEvent: 'Edit $t(common.event, lowercase)',
          reactivateEvent: 'Reactivate $t(common.event, lowercase)',
          userLotteryRatioDescription:
            "Current $t(common.lottery, lowercase) ratio is {{lotteryRatio}} ({{participateCount}} participations / {{hitCount}} $t(common.lottery, lowercase) 'wins')\n\nThe participant with the highest $t(common.lottery, lowercase) ratio within the $t(common.event_plural) available participants 'wins' the $t(common.lottery, lowercase). In case of two participants have the same ratio, the dice are rolled. This feature will take care that everyone will be selected in the same ratio.",
        },
        eventList: {
          title: '$t(common.event_plural)',
          searchPlaceholder: 'Name',
          createEventButton: 'Create $t(common.event, lowercase)',
          loadMoreButton: 'Load more',
          gotoButton: 'Go to $t(common.event, lowercase)',
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
        createRestaurantButton: 'Create $t(common.restaurant, lowercase)',
      },
      siteList: {
        createSiteButton: 'Create $t(common.site, lowercase)',
      },
      siteDetail: {
        editButton: 'Edit $t(common.site, lowercase)',
      },
    },
  },
};
