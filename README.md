1) Login (/auth/login) (POST)
    - roll_no and password required
    - special roll_no for admins
2) Reset Password Request (/auth/reset) (POST)
    - roll_no required
    - Link sended on gmail
    - valid for 5mins
    - 1 time usable
3) Change Password Request (/auth/reset/:ticket) (POST)
    - password and ticket required
    - if after this reset request the password is changes through another reset link than this link becomes invalid
    - after the reset all the tokens related to this Account becomes invalid
    - ticket should be fresh and unused.
3) Create new post (/booth/post/new) (POST)
    - post_title and post_category , allowed required
    - Allowed users can access this api
4) Create booth (/booth/booth/new) (POST)
    - Allowed users can access this api
    - post_id , voters and candidates is required
    - Data structure for voters and candidates
        <code>["010",...]</code>
        * all the codes must be valid.
5) Apply for candidature (/booth/candidate/apply) (POST)
    - booth_id, profile_pic and manifesto,video required.
    - student can only apply if he has not apply in the booths use currently at phase 0.
    - profile_pic and manifeto must be a single file and
    - profile_pic must be less than 1MB.
    - manifesto must be less than 10MB.
6) Change Booth Phase (/booth/next-phase) (POST)
    - booth_id required
    - Allowed users can access this api
7) Get Posts (/booth/post/all) (GET)
    - Allowed users can access this api
8) Delete Post (/booth/post/delete) (POST)
    - post_id is required
    - Allowed users can access this api
9) Get booths (/booth/all) (GET)
    - Allowed users can access this api
10) Review Candidate (/booth/review) (POST)
    - candidate_id, action
    - Allowed users can access this api
    - candidate not have already been reviewed;
11) Get Applications for revierw (/booth/applications) (POST)
    - booth_id is required
    - Allowed users can access this api
12) Withdrawal for Application (/booth/withdraw) (POST)
    - booth_id is required.
    - Allowed users can access this api.
    - Booth phase should be 2.
13) Get candidates After Review Phase (/booth/candidates) (POST)
    - booth_id is required
    - Allowed users can access this api.
    - Booth phase shoulb be greater than 1.
14) Voting (/booth/vote) (POST)
    - booth_id, candidate_id required
    - user should be eligible for voting and should not have voted for the booth eariler.
15) Process Result (/booth/process-result) (POST)
    - booth_id required
    - it should not be processed eariler
    - booth_phase should be 5
    - votes will be deleted
16) Get Result (/booth/result) (POST)
    - booth_id required
    - it should be announced
17) Get user deatail for admin (/admin/user/:roll_no) (GET)
    - params roll_no
18) Update User Role for admin (/admin/role/change) (POST)
    - roll_no, role required
19) Add machine (/admin/add/machine) (POST)
    - ip, machine_name required
20) Get all machine (/admin/machine/all) (GET)

21) Delete Machine (/admin/machine/delete) (POST)
    - machine_id required