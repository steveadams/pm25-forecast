import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { PrivacyModal } from './PrivacyModal';
import { AboutModal } from './AboutModal';
import { SubscribeModal } from './SubscribeModal';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  return (
    <header>
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="flex -m-1.5 p-1.5 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-auto fill-red-500"
              viewBox="0 0 448 512"
            >
              <path d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z" />
            </svg>
            <span className="ml-2 text-gray-700 font-black text-xl dark:text-gray-50">
              SmokeBuddy
            </span>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-100"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12 text-gray-900 dark:text-gray-50">
          <a
            href="#about"
            className="text-sm font-semibold leading-6 plausible-event-name=Read+About"
            onClick={() => setAboutOpen(true)}
          >
            About
          </a>
          <a
            href="#privacy"
            className="text-sm font-semibold leading-6 plausible-event-name=Read+Privacy"
            onClick={() => setPrivacyOpen(true)}
          >
            Privacy
          </a>
          <a
            href="#subscribe"
            className="text-sm font-semibold leading-6 plausible-event-name=Open+Subscribe+Modal"
            onClick={() => setSubscribeOpen(true)}
          >
            Subscribe
          </a>
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white dark:bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">SmokeBuddy</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-auto fill-red-500"
                viewBox="0 0 448 512"
              >
                <path d="M159.3 5.4c7.8-7.3 19.9-7.2 27.7 .1c27.6 25.9 53.5 53.8 77.7 84c11-14.4 23.5-30.1 37-42.9c7.9-7.4 20.1-7.4 28 .1c34.6 33 63.9 76.6 84.5 118c20.3 40.8 33.8 82.5 33.8 111.9C448 404.2 348.2 512 224 512C98.4 512 0 404.1 0 276.5c0-38.4 17.8-85.3 45.4-131.7C73.3 97.7 112.7 48.6 159.3 5.4zM225.7 416c25.3 0 47.7-7 68.8-21c42.1-29.4 53.4-88.2 28.1-134.4c-4.5-9-16-9.6-22.5-2l-25.2 29.3c-6.6 7.6-18.5 7.4-24.7-.5c-16.5-21-46-58.5-62.8-79.8c-6.3-8-18.3-8.1-24.7-.1c-33.8 42.5-50.8 69.3-50.8 99.4C112 375.4 162.6 416 225.7 416z" />
              </svg>
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <a
                  href="#about"
                  onClick={() => setAboutOpen(true)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  About
                </a>
                <a
                  href="#privacy"
                  onClick={() => setPrivacyOpen(true)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Privacy
                </a>
                <a
                  href="#subscribe"
                  onClick={() => setSubscribeOpen(true)}
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Subscribe
                </a>
              </div>
              {/* <div className="py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  <span className="sr-only">Help</span>
                  <QuestionMarkCircleIcon
                    className="h-6 w-6 ml-1"
                    aria-hidden="true"
                  />
                </a>
              </div> */}
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      <PrivacyModal open={privacyOpen} setOpen={setPrivacyOpen} />
      <AboutModal open={aboutOpen} setOpen={setAboutOpen} />
      <SubscribeModal open={subscribeOpen} setOpen={setSubscribeOpen} />
    </header>
  );
};

export { Header };
