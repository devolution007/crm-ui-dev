import { useRouter } from 'vue-router'
import { Notify } from 'quasar'

/**
 * This code solves the problem of dynamic route imports failing silently.
 * It will show a notification to the user when a dynamic route import fails.
 *
 * The problem details:
 * 1. You deploy the application
 * 2. The CustomersPage is not loaded yet. It is in a separate chunk CustomersPage.abc123.js and will be loaded on demand.
 * 3. The visitor loads the application
 * 4. You make changes in your code. Not necessarily to the CustomersPage component itself, but after the build process,
 * the CustomersPage now has a different hash in its filename (CustomersPage.def456.js)
 * 5. The visitor still has the old application loaded in their browser. They click on the CustomersPage link.
 * 6. The application tries to load the CustomersPage.abc123.js chunk, but it is not there anymore.
 * It throws a console error. But the user does not see it. For them, the application just does not load the CustomersPage.
 */
export default function useDynamicRouteImportFailed () {
  const bind = () => {
    const router = useRouter()
    router.onError((error) => {
      if (error.message.includes('Failed to fetch dynamically imported module')) {
        Notify.create({
          message: 'The update is required. It looks like you are using an outdated version of the application.',
          caption: 'Failed to load requested page. Please refresh tab to continue.',
          html: true,
          multiLine: true,
          color: 'blue-2',
          textColor: 'brown-9',
          icon: 'system_update_alt',
          closeBtn: 'Refresh',
          timeout: 0,
          position: 'top',
          onDismiss: () => {
            window.location.reload()
          }
        })
      }
    })
  }

  return {
    bind
  }
}
