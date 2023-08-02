import { Dispatch, FC, Fragment, SetStateAction, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const AboutModal: FC<{
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
                  <QuestionMarkCircleIcon
                    className="h-12 w-12 text-green-600 bg-green-300/25 rounded-full p-2"
                    aria-hidden="true"
                  />
                  <div className="ml-4">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-black leading-6"
                    >
                      What's SmokeBuddy?
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm font-semibold">
                        Here's what we're up to, and why.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="my-6 px-4 text-sm flex flex-col gap-y-3 text-gray-700 dark:text-gray-200">
                  <p>
                    Meet SmokeBuddy, your friendly neighborhood guide to
                    Canada's wildfire data. We know, it's not the easiest thing
                    to find or understand, and that's where we come in. We take
                    the heavy, technical data and transform it into something
                    you can actually use—and not break a sweat doing so!
                  </p>

                  <p>
                    Every night, while you're probably dreaming, SmokeBuddy is
                    wide awake. Around 2am PST, we're busy crunching new data
                    from the Canadian government and Apple WeatherKit. This
                    keeps our interface as current as possible, and lets us
                    notify you as promptly as possible if somthing ugly's on the
                    way.
                  </p>

                  <p>
                    Our goal? To make SmokeBuddy so handy that you'll wonder how
                    you ever got by without it. The more people rely on this
                    data, the more we can push for even better public data and
                    software.
                  </p>

                  <p>
                    Wildfires and air quality matter, and with our climate
                    changing on several fronts, we're going to need top-notch
                    data and software to stay safe. SmokeBuddy believes in being
                    the change we want to see in the world. So here we are,
                    working towards a safer, healthier future.
                  </p>
                </div>

                <div className="mt-5 px-4 ml-auto">
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

export { AboutModal };
