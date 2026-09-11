import asyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { LoginValidation, RegisterValidation } from "../validations/auth.validation";
import { StatusCodes } from "../constants/statusCodes.constant";
import { AppError } from "../utils/App.util";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { generateToken } from "../utils/jwt.util";
import type { IBaseResponse } from "../interfaces/base.interface";
import type { IRegisterResponse } from "../interfaces/register.interface";
import type { IUserResponse } from "../interfaces/login.interface";
import Candidate from "../models/candidate.model";
import Employer from "../models/employer.model";
import type { IProfileResponse } from "../interfaces/profile.interface";


// route POST /api/auth/register
// @desc Register a user
// @access Public
export const Register = asyncHandler(async (req: Request, res: Response) => {
    const result = RegisterValidation.safeParse(req.body);

    

    if (!result.success) {
        throw new AppError(result.error.issues[0]?.message ?? "Invalid registration data", StatusCodes.BAD_REQUEST);
    }
    const { name, email, role } = result.data;
    
    if (await User.findOne({ email })) {
        throw new AppError("Email already exists", StatusCodes.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role
    });

    await newUser.save();

    // If the role is "candidate", create a new Candidate document
    if (role === "candidate") {
        const newCandidate = new Candidate({
            user: newUser._id,
            skills: result.data.skills,
            experience: result.data.experience,
            bio: result.data.bio
        });
        await newCandidate.save();
    }

    // If the role is "employer", create a new Employer document
    if (role === "employer") {
        const newEmployer = new Employer({
            user: newUser._id,
            company: result.data.company,
            description: result.data.description,
            company_size: result.data.company_size,
            founded_year: result.data.founded_year,
            industry: result.data.industry
        });
        await newEmployer.save();
    }

    const response: IBaseResponse<IRegisterResponse> = {
        status: StatusCodes.CREATED,
        message: "Registration data is valid",
        data: {
            name,
            email,
            role,
            createdAt: new Date()
        }
    };

    res.status(StatusCodes.CREATED).json(response);
})

// route POST /api/auth/login
// @desc Login a user
// @access Public
export const Login = asyncHandler(async (req: Request, res: Response) => {
    const result = LoginValidation.safeParse(req.body);

    if (!result.success) {
        throw new AppError(result.error.issues[0]?.message ?? "Invalid login data", StatusCodes.BAD_REQUEST);
    }

    const { email, password } = result.data;
    const user = await User.findOne({ email });

    if (!user || user.status !== "active" || !(await bcrypt.compare(password, user.password))) {
        throw new AppError("Invalid email or password", StatusCodes.UNAUTHORIZED);
    }

    const token = generateToken({
        id: user._id.toString(),
        email: user.email,
        role: user.role
    });

    const response: IBaseResponse<IUserResponse> = {
        status: StatusCodes.OK,
        message: "Login successful",
        data: {
            name: user.name,
            email: user.email,
            role: user.role,
            token
        }
    };

    res.status(StatusCodes.OK).json(response);
});

// route POST /api/auth/logout
// @desc Log out the authenticated user
// @access Private
export const Logout = asyncHandler(async (_req: Request, res: Response) => {
    res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "Logout successful"
    });
});


export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find();
    res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "Users retrieved successfully",
        data: users
    });
});


export const profile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
    }

    const user = await User.findById(userId).select("name email role").lean();

    if (!user) {
        throw new AppError("User not found", StatusCodes.NOT_FOUND);
    }

    let data: IProfileResponse;

    if (user.role === "candidate") {
        const candidate = await Candidate.findOne({ user: user._id })
            .select("skills experience bio -_id")
            .lean();

        if (!candidate) {
            throw new AppError("Candidate profile not found", StatusCodes.NOT_FOUND);
        }

        data = {
            name: user.name,
            email: user.email,
            role: "candidate",
            profile: {
                skills: candidate.skills ?? [],
                experience: candidate.experience,
                bio: candidate.bio
            }
        };
    } else if (user.role === "employer") {
        const employer = await Employer.findOne({ user: user._id })
            .select("company description company_size founded_year industry -_id")
            .lean();

        if (!employer) {
            throw new AppError("Employer profile not found", StatusCodes.NOT_FOUND);
        }

        data = {
            name: user.name,
            email: user.email,
            role: "employer",
            profile: {
                company: employer.company,
                description: employer.description,
                company_size: employer.company_size,
                founded_year: employer.founded_year,
                industry: employer.industry
            }
        };
    } else {
        data = {
            name: user.name,
            email: user.email,
            role: "admin",
            profile: null
        };
    }

    const response: IBaseResponse<IProfileResponse> = {
        status: StatusCodes.OK,
        message: "Profile retrieved successfully",
        data
    };

    res.status(StatusCodes.OK).json(response);
});
