import { Dispatch, FC, Fragment, SetStateAction, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  EnvelopeIcon,
  FingerPrintIcon,
  MapPinIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

type PrivacyContent = {
  title: string;
  Icon: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<React.SVGProps<SVGSVGElement>>
  >;
  description: JSX.Element;
};

const privacyContents: PrivacyContent[] = [
  {
    title: 'Email Address',
    Icon: EnvelopeIcon,
    description: (
      <p>
        Your email address is used to send you notifications when the air
        quality is poor. We don't share you email address with anyone, and you
        can unsubscribe from notifications any time. We use{' '}
        <a
          href="https://mailchimp.com"
          className="text-blue-600 hover:text-blue-500"
          target="_blank"
          rel="external"
          tabIndex={-1}
        >
          Mailchimp
        </a>{' '}
        behind the scenes, which is a highly compliant email service provider.
      </p>
    ),
  },
  {
    title: 'Location',
    Icon: MapPinIcon,
    description: (
      <>
        <p>
          When you provide your location, it's completely anonymous until you
          subscribe for notifications. At that point, your data is stored with
          Mailchimp where your personal information is about as safe as it can
          be.
        </p>

        <p>
          We never store your location data on our servers — especially not with
          your email address.
        </p>
      </>
    ),
  },
  {
    title: 'Tracking',
    Icon: EyeSlashIcon,
    description: (
      <>
        <p>
          We use{' '}
          <a
            href="https://plausible.io"
            rel="external"
            target="_blank"
            className="text-blue-600 hover:text-blue-500"
            tabIndex={-1}
          >
            Plausible.io
          </a>{' '}
          to track anonymous usage of this service. You can{' '}
          <a
            href="https://plausible.io/smokebuddy.app/"
            rel="external"
            target="_blank"
            className="text-blue-600 hover:text-blue-500"
            tabIndex={-1}
          >
            view this site's usage statistics here
          </a>
          .
        </p>
        <p>
          It doesn't know who you are or where you've been, and it stores no
          identifying information about you. All analytics for this website are
          owned by SmokeBuddy, and are used for the express purpose of improving
          the service.
        </p>
      </>
    ),
  },
];

const PrivacyModal: FC<{
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="flex">
                  <FingerPrintIcon
                    className="h-12 w-12 text-purple-600 bg-purple-500/20 rounded-full p-2"
                    aria-hidden="true"
                  />
                  <div className="ml-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-black leading-6"
                    >
                      Your Privacy
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm font-semibold">
                        How is your data used by SmokeBuddy?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="my-6">
                  <ul role="list" className="flex flex-col gap-4">
                    {privacyContents.map(({ title, description, Icon }) => (
                      <li
                        key={title}
                        className="text-gray-700 dark:text-gray-200 bg-gray-300/10 dark:bg-gray-500/10 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-x-3 mb-3">
                          <Icon className="h-8 w-8 p-2 flex-none rounded-full bg-gray-300/50 text-gray-900" />
                          <h3 className="flex-auto truncate text-sm font-semibold leading-6 text-gray-900 dark:text-gray-50">
                            {title}
                          </h3>
                        </div>
                        <span className="space-y-3 text-sm">{description}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 ml-auto">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Okay
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export { PrivacyModal };
