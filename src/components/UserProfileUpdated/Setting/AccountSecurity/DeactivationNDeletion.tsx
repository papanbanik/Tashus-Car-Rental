'use client';
import Link from 'next/link';
const DeactivationNDeletion = () => {
  return (
    <div>
      <div className="my-4 flex flex-col text-justify">
        <div>
          <span className="text-md font-semibold">Account Deactivation</span>
        </div>
        <div>
          <span>
            Account deactivation allows you to temporarily disable your Tashus account. During this period, your vehicles and account information will
            be temporarily hidden from search results. You can easily reactivate your account at any time by logging in.
          </span>
          <span>
            To deactivate your account, visit your{' '}
            <Link className="text-primary font-semibold" href={`${process.env.NEXT_PUBLIC_DOMAIN}/settings/account-update?option=deactivate`}>
              Account Deactivation
            </Link>{' '}
            page, where you can initiate the deactivation process.
          </span>
        </div>
      </div>
      {/* <div className="my-4 text-justify">
        <SectionHeader title="Account Deletion" />
        <span>
          Account deletion is a permanent action that permanently removes your Tashus account. Once your account is deleted, you will lose access to
          all account-related features and data. Any vehicles you previously listed will be permanently removed, and your account will no longer
          appear in searches.
        </span>
        <span>
          To proceed with account deletion, visit your{' '}
          <Link className="text-primary font-semibold" href={`${process.env.NEXT_PUBLIC_DOMAIN}/settings/account-update?option=delete`}>
            Account Deletion
          </Link>{' '}
          page, where you can initiate the deletion process.
        </span>
      </div> */}
    </div>
  );
};

export default DeactivationNDeletion;
