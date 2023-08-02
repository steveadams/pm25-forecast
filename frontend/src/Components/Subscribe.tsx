const Subscribe = () => (
  <div className="relative overflow-hidden max-w-3xl mx-auto my-6 lg:max-w-4xl px-6 py-12 shadow-xl sm:rounded-3xl sm:px-10 sm:py-16 md:px-12 lg:px-20">
    {/* Add a background image */}
    <img
      className="absolute inset-0 h-full w-full object-cover"
      src="https://images.unsplash.com/photo-1476231682828-37e571bc172f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
      alt=""
    />

    {/* Dim the background image to make the text more readable */}
    <div className="absolute inset-0 bg-black/70" />

    {/* Content here */}
    <div className="relative mx-auto w-full lg:mx-0">
      <h2 className="mx-auto text-center text-3xl font-black tracking-tight text-white sm:text-4xl">
        Get notified when smoke is coming.
      </h2>
      <p className="mx-auto mt-2 text-center text-lg leading-8 text-white">
        We'll only send you email when the forecast warrants it.
      </p>

      <form className="mx-auto mt-10 flex max-w-md gap-x-4">
        <label htmlFor="email-address" className="sr-only">
          Email address
        </label>
        <input
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus={false}
          className="min-w-0 flex-auto rounded-md border-0 font-semibold bg-white/10 px-3.5 py-2 text-white shadow-sm ring-2 ring-inset ring-white/50 focus:ring-3 focus:ring-inset focus:ring-white focus:bg-white/20 sm:leading-6 placeholder:text-white/80"
          placeholder="Enter your email"
        />
        <button
          type="submit"
          className="flex-none rounded-md bg-white px-3 py-2 font-bold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Notify me
        </button>
      </form>
      <svg
        viewBox="0 0 1024 1024"
        className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2"
        aria-hidden="true"
      >
        <circle
          cx={512}
          cy={512}
          r={512}
          fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
          fillOpacity="0.5"
        />
        <defs>
          <radialGradient
            id="759c1415-0410-454c-8f7c-9a820de03641"
            cx={0}
            cy={0}
            r={1}
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(512 512) rotate(90) scale(512)"
          >
            <stop stopColor="#fff" />
            <stop offset={1} stopColor="#E935C1" stopOpacity={0} />
          </radialGradient>
        </defs>
      </svg>
    </div>
  </div>
);

export { Subscribe };
